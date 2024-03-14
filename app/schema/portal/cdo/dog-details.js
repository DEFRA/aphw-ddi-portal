const Joi = require('joi')
const { getDateComponents } = require('../../../lib/date-helpers')
const { validateCdoIssueDate, validateInterimExemptionDate, calculateCdoExpiryDate } = require('../../../lib/validation-helpers')

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
  }).custom(validateCdoIssueDate),
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
  payload.cdoExpiry = calculateCdoExpiryDate(payload.cdoIssued)
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
