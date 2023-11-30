const Joi = require('joi')

const schema = Joi.object({
  breed: Joi.string().trim().required().messages({
    'string.base': 'Breed type is required',
    'string.empty': 'Breed type is required',
    'any.required': 'Breed type is required'
  }),
  name: Joi.string().required().trim().optional().messages({
    'string.base': 'Dog name must be a string',
    'string.empty': 'Dog name is required'
  }),
  cdoIssued: Joi.date().iso().required().messages({
    'string.empty': 'CDO issue date is required',
    'date.format': 'CDO issue date must be a valid date'
  }),
  cdoExpiry: Joi.date().iso().required()
}).required()

module.exports = schema
