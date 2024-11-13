const Joi = require('joi')

const submitEmailSchema = Joi.object({
  policeUser: Joi.string().trim().email().required().messages({
    'string.empty': 'Enter a police officer\'s email address',
    'any.required': 'Enter a police officer\'s email address',
    'string.email': 'Enter a police officer\'s email address'
  }),
  policeUserIndex: Joi.number().optional()
})

const submitEmailConflictSchema = (field) => Joi.object({
  [field]: Joi.any().forbidden().messages({
    '*': 'This police officer already has access'
  })
}).optional()

const submitEmailSessionConflictSchema = (field) => Joi.object({
  [field]: Joi.any().forbidden().messages({
    '*': 'This police officer\'s details have already been entered'
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

const policeOfficerListQuerySchema = Joi.object({
  policeForce: Joi.number().allow('').optional()
})

module.exports = {
  submitEmailSchema,
  submitEmailConflictSchema,
  submitEmailSessionConflictSchema,
  submitListSchema,
  confirmListSchema,
  policeOfficerListQuerySchema
}
