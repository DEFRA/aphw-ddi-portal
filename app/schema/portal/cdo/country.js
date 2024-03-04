const Joi = require('joi')

const countrySchema = Joi.object({
  country: Joi.string().trim().required()
}).required()

const validatePayload = (payload) => {
  const { value, error } = countrySchema.validate(payload, { abortEarly: false })

  if (error) {
    throw error
  }

  return value
}

module.exports = {
  validatePayload
}
