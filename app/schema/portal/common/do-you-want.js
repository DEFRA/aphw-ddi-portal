const Joi = require('joi')

const validateDoYouWantSchema = Joi.object({
  addOrRemove: Joi.string().valid('add', 'remove').required().messages({
    '*': 'Select an option'
  }),
  submitButton: Joi.string().allow(null).allow('').optional()
})

const validatePayload = (payload) => {
  const { error, value } = validateDoYouWantSchema.validate(payload)

  if (error) {
    throw error
  }

  return value
}

module.exports = { validatePayload }
