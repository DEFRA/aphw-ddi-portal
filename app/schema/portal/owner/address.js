const Joi = require('joi')

const schema = Joi.object({
  addressLine1: Joi.string().trim().required().messages({
    'string.empty': 'Enter the first line of the address'
  }),
  addressLine2: Joi.string().trim().allow(null).optional(),
  town: Joi.string().trim().required().messages({
    'string.empty': 'Enter the town or city'
  }),
  county: Joi.string().trim().required().messages({
    'string.empty': 'Select the county'
  }),
  postcode: Joi.string().trim().required().messages({
    'string.empty': 'Enter the postcode'
  }),
  country: Joi.string().trim().required().messages({
    'string.empty': 'Select the country'
  })
}).required()

module.exports = schema
