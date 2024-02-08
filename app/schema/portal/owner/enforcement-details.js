const Joi = require('joi')

const schema = Joi.object({
  court: Joi.string().optional().allow('').allow(null),
  policeForce: Joi.string().required().messages({
    'string.empty': 'Select a police force'
  }),
  legislationOfficer: Joi.string().trim().allow('').optional().max(64).messages({
    'string.max': 'Dog legislation officer must be no more than {#limit} characters'
  })
}).required()

module.exports = schema
