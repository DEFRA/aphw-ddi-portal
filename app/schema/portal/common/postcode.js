const Joi = require('joi')
const postcodeRegex = /^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i

const postcodeValidation = Joi.string().trim().required().max(8).regex(postcodeRegex).messages({
  'string.empty': 'Enter a postcode',
  'string.max': 'Postcode must be no more than {#limit} characters',
  'string.pattern.base': 'Enter a real postcode'
})

const houseNumberValidation = Joi.string().trim().optional().allow('').allow(null).max(24).messages({
  'string.max': 'Property name or number must be no more than {#limit} characters'
})

const validatePayloadBuilder = (schema) => (payload) => {
  const { value, error } = schema.validate(payload, { abortEarly: false })

  if (error) {
    throw error
  }

  return value
}

module.exports = {
  postcodeRegex,
  postcodeValidation,
  houseNumberValidation,
  validatePayloadBuilder
}
