const Joi = require('joi')
const { UTCDate } = require('@date-fns/utc')
const { isValid, isFuture, addMonths, parse } = require('date-fns')
const { getDateComponents } = require('../../../lib/date-helpers')

const validDateFormats = [
  'yyyy-MM-dd',
  'yyyy-M-d'
]

const parseCdoIssueDate = (value) => {
  for (const fmt of validDateFormats) {
    const date = parse(value, fmt, new UTCDate())

    if (isValid(date)) {
      return date
    }
  }

  return null
}

const calculateExpiryDate = (value) => {
  const dateString = `${value.year}-${value.month}-${value.day}`

  return addMonths(parseCdoIssueDate(dateString), 2)
}

const validateIssueDate = (value, helpers) => {
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
    const date = parseCdoIssueDate(dateString)

    if (!date) {
      return helpers.message('Enter a real date', { path: ['cdoIssued', ['day', 'month', 'year']] })
    }

    if (isFuture(date)) {
      return helpers.message('Enter a date that is in the past', { path: ['cdoIssued', ['day', 'month', 'year']] })
    }

    return date
  }

  if (invalidComponents.length === 3) {
    return helpers.message('Enter a CDO issue date', { path: ['cdoIssued', ['day', 'month', 'year']] })
  }

  const errorMessage = `A CDO issue date must include a ${invalidComponents.join(' and ')}`

  return helpers.message(errorMessage, { path: ['cdoIssued', invalidComponents] })
}

const dogDetailsSchema = Joi.object({
  breed: Joi.string().trim().required().messages({
    '*': 'Breed type is required'
  }),
  name: Joi.string().trim().max(32).allow('').allow(null).optional().messages({
    'string.max': 'Dog name must be no more than {#limit} characters'
  }),
  cdoIssued: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).custom(validateIssueDate),
  cdoExpiry: Joi.date().iso().required()
}).required()

const validatePayload = (payload) => {
  payload.cdoIssued = getDateComponents(payload, 'cdoIssued')
  payload.cdoExpiry = calculateExpiryDate(payload.cdoIssued)

  const schema = Joi.object({
    'cdoIssued-year': Joi.number().allow(null).allow(''),
    'cdoIssued-month': Joi.number().allow(null).allow(''),
    'cdoIssued-day': Joi.number().allow(null).allow(''),
    dogId: Joi.number().optional()
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
