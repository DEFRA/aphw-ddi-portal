const Joi = require('joi')

const schema = Joi.object({
  queryType: Joi.string().valid('search', 'date', 'dog', 'owner', 'user', 'login').required().messages({
    '*': 'Select an option'
  })
})

const validatePayload = (payload) => {
  const { error, value } = schema.validate(payload)

  if (error) {
    throw error
  }

  return value
}

module.exports = { validatePayload }
