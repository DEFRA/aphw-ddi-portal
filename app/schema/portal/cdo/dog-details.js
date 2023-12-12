const Joi = require('joi')
const { UTCDate } = require('@date-fns/utc')
const { isValid, isFuture, addMonths, parse } = require('date-fns')
const { dateComponentsToString } = require('../../../lib/date-helpers')

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

const validateDate = (value, helpers) => {
  if (value === '--') {
    return helpers.message('Enter a CDO issue date')
  }

  const date = parseCdoIssueDate(value)

  if (date) {
    return date
  }

  return helpers.message('CDO issue date must be a real date')
}

const validateIssueDate = (value, helpers) => {
  if (typeof value === 'object' && isFuture(value)) {
    return helpers.message('CDO issue date must not be in the future')
  }

  return value
}

const dogDetailsSchema = Joi.object({
  breed: Joi.string().trim().required().messages({
    '*': 'Breed type is required'
  }),
  name: Joi.string().trim().allow('').allow(null).optional(),
  cdoIssued: Joi.string().required().messages({
    'string.base': 'Enter a CDO issue date',
    'string.empty': 'Enter a CDO issue date'
  }).custom(validateDate).custom(validateIssueDate),
  cdoExpiry: Joi.date().iso().required()
}).required()

const validatePayload = (payload) => {
  payload.cdoIssued = dateComponentsToString(payload, 'cdoIssued')

  payload.cdoExpiry = addMonths(parseCdoIssueDate(payload.cdoIssued), 2)

  const schema = Joi.object({
    'cdoIssued-day': Joi.number().required().messages({
      '*': 'CDO issue date must include a valid day'
    }),
    'cdoIssued-month': Joi.number().required().messages({
      '*': 'CDO issue date must include a valid month'
    }),
    'cdoIssued-year': Joi.number().min(2020).required().messages({
      '*': 'CDO issue date must include a valid year',
      'number.min': 'CDO issue year must be 2020 or later'
    }),
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
