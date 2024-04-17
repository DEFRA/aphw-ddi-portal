const Joi = require('joi')

const schema = Joi.object({
  confirm: Joi.string().required().messages({
    '*': 'Select an option'
  }),
  pk: Joi.string().optional().allow('').allow(null)
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
