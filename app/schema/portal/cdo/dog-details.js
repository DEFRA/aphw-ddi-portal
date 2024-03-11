const Joi = require('joi')
const { isFuture, addMonths, isWithinInterval, sub } = require('date-fns')
const { getDateComponents, parseDate } = require('../../../lib/date-helpers')

const calculateExpiryDate = (value) => {
  const dateString = `${value.year}-${value.month}-${value.day}`

  if (dateString === '--' || dateString === 'undefined-undefined-undefined') {
    return null
  }

  return addMonths(parseDate(dateString), 2)
}

const validateIssueDate = (value, helpers) => {
  if (helpers.state.ancestors[0].applicationType !== 'cdo') {
    return null
  }

  const { day, month, year } = value
  const dateComponents = { day, month, year }
  const invalidComponents = []

  for (const key in dateComponents) {
    if (!dateComponents[key]) {
      invalidComponents.push(key)
    }
  }

  if (parseInt(year) < 2020) {
    return helpers.message('The CDO issue year must be 2020 or later', { path: ['cdoIssued', ['year']] })
  }

  if (invalidComponents.length === 0) {
    const dateString = `${year}-${month}-${day}`
    const date = parseDate(dateString)

    if (!date) {
      return helpers.message('Enter a real date', { path: ['cdoIssued', ['day', 'month', 'year']] })
    }

    if (isFuture(date)) {
      return helpers.message('Enter a date that is today or in the past', { path: ['cdoIssued', ['day', 'month', 'year']] })
    }

    return date
  }

  if (invalidComponents.length === 3) {
    return helpers.message('Enter a CDO issue date', { path: ['cdoIssued', ['day', 'month', 'year']] })
  }

  const errorMessage = `A CDO issue date must include a ${invalidComponents.join(' and ')}`

  return helpers.message(errorMessage, { path: ['cdoIssued', invalidComponents] })
}

const validateInterimExemptionDate = (value, helpers) => {
  if (helpers.state.ancestors[0].applicationType !== 'interim-exemption') {
    return null
  }

  const { day, month, year } = value
  const dateComponents = { day, month, year }
  const invalidComponents = []

  for (const key in dateComponents) {
    if (!dateComponents[key]) {
      invalidComponents.push(key)
    }
  }

  if (invalidComponents.length === 0) {
    const dateString = `${year}-${month}-${day}`
    const date = parseDate(dateString)

    if (!date) {
      return helpers.message('Enter a real date', { path: ['interimExemption', ['day', 'month', 'year']] })
    }

    if (isFuture(date)) {
      return helpers.message('Enter a date that is today or in the past', { path: ['interimExemption', ['day', 'month', 'year']] })
    }

    const now = new Date()
    if (!isWithinInterval(date, { start: sub(now, { years: 1 }), end: now })) {
      return helpers.message('Date joined scheme year must be within the last 12 months', { path: ['interimExemption', ['year']] })
    }

    return date
  }

  if (invalidComponents.length === 3) {
    return helpers.message('Enter a Date joined scheme', { path: ['interimExemption', ['day', 'month', 'year']] })
  }

  const errorMessage = `Date joined scheme must include a ${invalidComponents.join(' and ')}`

  return helpers.message(errorMessage, { path: ['interimExemption', invalidComponents] })
}

const dogDetailsSchema = Joi.object({
  breed: Joi.string().trim().required().messages({
    '*': 'Breed type is required'
  }),
  name: Joi.string().trim().max(32).allow('').allow(null).optional().messages({
    'string.max': 'Dog name must be no more than {#limit} characters'
  }),
  applicationType: Joi.string().trim().required().messages({
    '*': 'Application type is required'
  }),
  cdoIssued: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).custom(validateIssueDate),
  interimExemption: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).custom(validateInterimExemptionDate),
  cdoExpiry: Joi.date().iso().allow(null).allow('').optional(),
  microchipNumber: Joi.string().allow(null).allow('').optional()
}).required()

const validatePayload = (payload) => {
  payload.cdoIssued = getDateComponents(payload, 'cdoIssued')
  payload.interimExemption = getDateComponents(payload, 'cdoIssued')
  payload.cdoExpiry = calculateExpiryDate(payload.cdoIssued)
  payload.interimExemption = getDateComponents(payload, 'interimExemption')

  const schema = Joi.object({
    'cdoIssued-year': Joi.number().allow(null).allow(''),
    'cdoIssued-month': Joi.number().allow(null).allow(''),
    'cdoIssued-day': Joi.number().allow(null).allow(''),
    dogId: Joi.number().optional(),
    'interimExemption-year': Joi.number().allow(null).allow(''),
    'interimExemption-month': Joi.number().allow(null).allow(''),
    'interimExemption-day': Joi.number().allow(null).allow('')
  }).concat(dogDetailsSchema)

  const { value, error } = schema.validate(payload, { abortEarly: false })

  if (error) {
    throw error
  }

  return value
}

module.exports = {
  dogDetailsSchema,
  validatePayload
}
