const Joi = require('joi')
const { calculateCdoExpiryDate } = require('../../../lib/validation-helpers')
const { getDateComponents } = require('../../../lib/date-helpers')
const { applicationTypeSchemaElements } = require('../common/components/application-type')

const applicationTypeSchema = Joi.object(
  applicationTypeSchemaElements
).required()

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
