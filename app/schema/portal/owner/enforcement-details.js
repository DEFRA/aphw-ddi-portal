const Joi = require('joi')

const schema = Joi.object({
  court: Joi.string().required().messages({
    'string.empty': 'Court is required'
  }),
  policeForce: Joi.string().required().messages({
    'string.empty': 'Police force is required'
  }),
  legislationOfficer: Joi.string().trim().allow('').optional().max(50).messages({
    'string.max': 'Dog legislation officer must be no more than {#limit} characters'
  })
}).required()

module.exports = schema
