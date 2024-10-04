const Joi = require('joi')

const submitEmailSchema = Joi.object({
  policeUser: Joi.string().email().required().messages({
    'string.empty': 'Enter a police officer',
    'any.required': 'Enter a police officer',
    'string.email': 'Email address must be real'
  })
})

const submitEmailConflictSchema = (field) => Joi.object({
  [field]: Joi.any().forbidden().messages({
    '*': 'This police officer is already in the allow list'
  })
}).optional()

module.exports = {
  submitEmailSchema,
  submitEmailConflictSchema
}
