const Joi = require('joi')
const { validateCdoIssueDate, validateInterimExemptionDate, calculateCdoExpiryDate } = require('../../../lib/validation-helpers')
const { getDateComponents } = require('../../../lib/date-helpers')

const applicationTypeSchema = Joi.object({
  applicationType: Joi.string().trim().required().messages({
    '*': 'Application type is required'
  }),
  cdoIssued: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).custom(validateCdoIssueDate),
  interimExemption: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).custom(validateInterimExemptionDate),
  cdoExpiry: Joi.date().iso().allow(null).allow('').optional()
}).required()

const validatePayload = (payload) => {
  payload.cdoIssued = getDateComponents(payload, 'cdoIssued')
  payload.interimExemption = getDateComponents(payload, 'interimExemption')
  payload.cdoExpiry = calculateCdoExpiryDate(payload.cdoIssued)

  const schema = Joi.object({
    'cdoIssued-year': Joi.number().allow(null).allow(''),
    'cdoIssued-month': Joi.number().allow(null).allow(''),
    'cdoIssued-day': Joi.number().allow(null).allow(''),
    dogId: Joi.number().optional(),
    'interimExemption-year': Joi.number().allow(null).allow(''),
    'interimExemption-month': Joi.number().allow(null).allow(''),
    'interimExemption-day': Joi.number().allow(null).allow('')
  }).concat(applicationTypeSchema)

  const { value, error } = schema.validate(payload, { abortEarly: false })

  if (error) {
    throw error
  }

  return value
}

module.exports = {
  validatePayload
}
