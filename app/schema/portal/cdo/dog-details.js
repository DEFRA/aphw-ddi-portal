const Joi = require('joi')
const { isFuture } = require('date-fns')

const validateIssueDate = (value, helpers) => {
  if (isFuture(value)) {
    return helpers.message('CDO issue date must not be in the future')
  }

  return value
}

const schema = Joi.object({
  breed: Joi.string().trim().required().messages({
    'string.base': 'Breed type is required',
    'string.empty': 'Breed type is required',
    'any.required': 'Breed type is required'
  }),
  name: Joi.string().trim().allow('').allow(null).optional(),
  cdoIssued: Joi.date().iso().required().messages({
    'string.empty': 'CDO issue date is required',
    'date.format': 'CDO issue date must be a valid date'
  }).custom(validateIssueDate),
  cdoExpiry: Joi.date().iso().required()
}).required()

module.exports = schema
