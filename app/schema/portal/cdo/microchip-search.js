const Joi = require('joi')

const validNewMicrochip = /^[0-9\s]+$/

const validateMicrochip = (value, helpers) => {
  if (!value.match(validNewMicrochip)) {
    return helpers.message('Microchip numbers can only contains numbers', { path: ['microchipNumber'] })
  }

  return value
}

const schema = Joi.object({
  microchipNumber: Joi.string().trim().required().max(15).messages({
    'string.max': 'Microchip number must be no more than {#limit} characters',
    'string.empty': 'Enter a microchip number'
  }).custom(validateMicrochip)
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
