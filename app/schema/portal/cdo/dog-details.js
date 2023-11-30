const Joi = require('joi')

const schema = Joi.object({
  breed: Joi.string().trim().required().messages({
    'string.base': 'The breed type is required',
    'string.empty': 'The breed type is required'
  }),
  name: Joi.string().allow(null).allow('').trim().optional(),
  cdoIssued: Joi.date().iso().required().messages({
    'string.empty': 'CDO issue date is required',
    'date.format': 'CDO issue date must be a valid date'
  })
}).required()

module.exports = schema
