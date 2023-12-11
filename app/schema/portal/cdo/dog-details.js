const Joi = require('joi')
const { UTCDate } = require('@date-fns/utc')
const { isMatch, isValid, isFuture, addMonths } = require('date-fns')
const { dateComponentsToString } = require('../../../lib/date-helpers')

const validateDate = (value, helpers) => {
  const format = isMatch(value, 'yyyy-MM-dd') ||
    isMatch(value, 'yyyy-M-d', { locale: 'enGB' }) ||
    null

  if (!format) {
    return helpers.message('CDO issue date must be a valid date')
  }

  const date = new Date(value)

  if (!isValid(date)) {
    return helpers.message('CDO issue date must be a valid date')
  }

  return date
}

const validateIssueDate = (value, helpers) => {
  if (isFuture(value)) {
    return helpers.message('CDO issue date must not be in the future')
  }

  return value
}

const dogDetailsSchema = Joi.object({
  breed: Joi.string().trim().required().messages({
    'string.base': 'Breed type is required',
    'string.empty': 'Breed type is required',
    'any.required': 'Breed type is required'
  }),
  name: Joi.string().trim().allow('').allow(null).optional(),
  cdoIssued: Joi.string().required().messages({
    'string.empty': 'CDO issue date is required'
  }).custom(validateDate).custom(validateIssueDate),
  cdoExpiry: Joi.date().iso().required()
}).required()

const validatePayload = (payload) => {
  payload.cdoIssued = dateComponentsToString(payload, 'cdoIssued')

  payload.cdoExpiry = addMonths(new UTCDate(payload.cdoIssued), 2)

  const schema = Joi.object({
    'cdoIssued-day': Joi.number().required().messages({
      'any.required': 'CDO issue date must include a valid day',
      'number.empty': 'CDO issue date must include a valid day',
      'number.base': 'CDO issue date must include a valid day'
    }),
    'cdoIssued-month': Joi.number().required().messages({
      'any.required': 'CDO issue date must include a valid month',
      'number.empty': 'CDO issue date must include a valid month',
      'number.base': 'CDO issue date must include a valid month'
    }),
    'cdoIssued-year': Joi.number().required().messages({
      'any.required': 'CDO issue date must include a valid year',
      'number.empty': 'CDO issue date must include a valid year',
      'number.base': 'CDO issue date must include a valid year'
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
