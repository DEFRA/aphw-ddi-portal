const Joi = require('joi')

const changeStatusSchema = Joi.object({
  indexNumber: Joi.string().required(),
  newStatus: Joi.string().trim().required().messages({
    '*': 'Select a status'
  }),
  backUrl: Joi.string().optional()
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
