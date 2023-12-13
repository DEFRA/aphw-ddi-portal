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

const validateDate = (value, helpers) => {
  if (!value.day && !value.month && !value.year) {
    return helpers.message('Enter a CDO issue date')
  }

  if (!value.day) {
    return helpers.message('CDO issue date must include a day', { path: ['cdoIssued', 'day'] })
  }

  if (!value.month) {
    return helpers.message('CDO issue date must include a month', { path: ['cdoIssued', 'month'] })
  }

  if (!value.year) {
    return helpers.message('CDO issue date must include a year', { path: ['cdoIssued', 'year'] })
  }

  const dateString = `${value.year}-${value.month}-${value.day}`

  const date = parseCdoIssueDate(dateString)

  if (date) {
    return date
  }

  return helpers.message('Enter a real date')
}

const validateIssueDate = (value, helpers) => {
  if (typeof value === 'object' && isFuture(value)) {
    return helpers.message('Enter a date that is in the past', { path: ['cdoIssued', 'year'] })
  }

  return value
}

const dogDetailsSchema = Joi.object({
  breed: Joi.string().trim().required().messages({
    '*': 'Breed type is required'
  }),
  name: Joi.string().trim().max(32).allow('').allow(null).optional().messages({
    'string.max': 'Dog name must be {#limit} characters or fewer'
  }),
  cdoIssued: Joi.object({
    year: Joi.number().allow(null).allow('').min(2020).messages({
      'number.min': 'The CDO issue year must be 2020 or later'
    }),
    month: Joi.number().allow(null).allow(''),
    day: Joi.number().allow(null).allow('')
  }).custom(validateDate).custom(validateIssueDate),
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
