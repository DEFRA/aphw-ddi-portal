const Joi = require('joi')

const postcodeRegex = /^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i

const schema = Joi.object({
  addressLine1: Joi.string().trim().required().max(50).messages({
    'string.empty': 'Enter first line of address',
    'any.required': 'Enter first line of address',
    'string.max': 'First line of address must be no more than {#limit} characters'
  }),
  addressLine2: Joi.string().trim().allow(null).allow('').max(50).optional().messages({
    'string.max': 'Second line of address must be no more than {#limit} characters'
  }),
  town: Joi.string().trim().required().max(50).messages({
    'string.empty': 'Enter town or city',
    'any.required': 'Enter town or city',
    'string.max': 'Town or city must be no more than {#limit} characters'
  }),
  postcode: Joi.string().trim().required().max(8).regex(postcodeRegex).messages({
    'string.empty': 'Enter a postcode',
    'any.required': 'Enter a postcode',
    'string.max': 'Postcode must be no more than {#limit} characters',
    'string.pattern.base': 'Postcode must be a real postcode'
  }),
  personReference: Joi.string().optional().allow(null).allow(''),
  country: Joi.string().trim().required().messages({
    'string.empty': 'Select a country',
    'any.required': 'Select a country'
  })
}).required()

module.exports = schema
