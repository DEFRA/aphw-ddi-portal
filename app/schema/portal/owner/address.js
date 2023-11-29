const Joi = require('joi')

const schema = Joi.object({
  addressLine1: Joi.string().trim().required().max(50).messages({
    'string.empty': 'Address line 1 is required',
    'string.max': 'Address line 1 must be no more than {#limit} characters'
  }),
  addressLine2: Joi.string().trim().allow(null).allow('').max(50).optional().messages({
    'string.max': 'Address line 2 must be no more than {#limit} characters'
  }),
  town: Joi.string().trim().required().max(50).messages({
    'string.empty': 'Town or city is required',
    'string.max': 'Town or city must be no more than {#limit} characters'
  }),
  postcode: Joi.string().trim().required().max(8).messages({
    'string.empty': 'Postcode is required',
    'string.max': 'Postcode must be no more than {#limit} characters'
  })
}).required()

module.exports = schema
