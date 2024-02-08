const Joi = require('joi')

const changeStatusSchema = Joi.object({
  indexNumber: Joi.string().required(),
  newStatus: Joi.string().trim().required().messages({
    '*': 'Select a status'
  }),
  srcHashParam: Joi.string().optional().allow('').allow(null)
}).required()

const validatePayload = (payload) => {
  const { value, error } = changeStatusSchema.validate(payload, { abortEarly: false })

  if (error) {
    throw error
  }

  return value
}

module.exports = {
  validatePayload
}
