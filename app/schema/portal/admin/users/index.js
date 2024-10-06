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

const submitEmailSessionConflictSchema = (field) => Joi.object({
  [field]: Joi.any().forbidden().messages({
    '*': 'This police officer has already been selected'
  })
}).optional()

const submitListSchema = Joi.object({
  continue: Joi.string().allow('').allow(null).required(),
  addAnother: Joi.boolean().truthy('Y').falsy('N').allow(true).allow(false).messages({
    '*': 'Select an option'
  }).required(),
  users: Joi.array().single().items(Joi.string().email()).min(1).messages({
    '*': 'There must be at least one police officer'
  }).required()
})

const confirmListSchema = Joi.object({
  continue: Joi.string().allow('').allow(null).required(),
  users: Joi.array().single().items(Joi.string().email()).min(1).messages({
    '*': 'There must be at least one police officer'
  }).required()
})

module.exports = {
  submitEmailSchema,
  submitEmailConflictSchema,
  submitEmailSessionConflictSchema,
  submitListSchema,
  confirmListSchema
}
