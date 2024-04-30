const Joi = require('joi')

const validateDoYouWantSchema = Joi.object({
  addRemoveCourt: Joi.string().valid('add', 'remove').required().messages({
    '*': 'Select an option'
  })
})

const validatePayload = (payload) => {
  const { error, value } = validateDoYouWantSchema.validate(payload)

  if (error) {
    throw error
  }

  return value
}

module.exports = { validatePayload }
