const Joi = require('joi')
const { validateMicrochip } = require('../../../lib/validation-helpers')

const schema = Joi.object({
  microchipNumber: Joi.string().trim().required().min(15).max(15).messages({
    'string.min': 'Microchip numbers must be {#limit} digits',
    'string.max': 'Microchip numbers must be {#limit} digits',
    'string.empty': 'Enter a microchip number'
  }).custom((value, helper) => validateMicrochip(value, helper, false)),
  dogId: Joi.string().allow('').allow(null).optional()
}).required()

const validatePayload = (payload) => {
  const { value, error } = schema.validate(payload, { abortEarly: false })

  if (error) {
    throw error
  }

  return value
}

module.exports = {
  validatePayload
}
