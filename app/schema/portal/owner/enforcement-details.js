const Joi = require('joi')

const schema = Joi.object({
  courtRequired: Joi.boolean(),
  court: Joi.string()
    .when('courtRequired',
      {
        is: Joi.valid(true),
        then: Joi.required(),
        otherwise: Joi.optional().allow('').allow(null)
      }
    ).messages({
      '*': 'Select a court'
    }),
  policeForce: Joi.string().required().messages({
    'string.empty': 'Select a police force'
  }),
  legislationOfficer: Joi.string().trim().allow('').optional().max(64).messages({
    'string.max': 'Dog legislation officer must be no more than {#limit} characters'
  })
}).required()

module.exports = schema
