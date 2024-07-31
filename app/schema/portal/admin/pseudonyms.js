const Joi = require('joi')
const { validatePayloadBuilder } = require('../common/postcode')

const schema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).trim().max(254).required().messages({
    'string.max': 'Email must be no more than {#limit} characters',
    'string.empty': 'Enter an email address',
    'any.required': 'Enter an email address',
    'string.email': 'Enter a valid email address'
  }),
  pseudonym: Joi.string().trim().required().messages({
    'string.empty': 'Enter a pseudonym',
    'any.required': 'Enter a pseudonym'
  })
}).required()

const duplicateEmailSchema = Joi.object({
  email: Joi.any().forbidden().messages({
    'any.unknown': 'This email address is already associated with another pseudonym'
  }),
  pseudonym: Joi.any().forbidden().messages({
    'any.unknown': 'Enter a different pseudonym'
  })
}).required()

const validatePseudonymPayload = validatePayloadBuilder(schema)

module.exports = {
  validatePseudonymPayload,
  duplicateEmailSchema
}
