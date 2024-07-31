const Joi = require('joi')
const { getDateComponents } = require('../../../lib/date-helpers')
const { validateOwnerDateOfBirth } = require('../../../lib/validation-helpers')
const { dateOfBirthSchema } = require('../common/components/date-of-birth')

const postcodeRegex = /^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i

const { isValidPhoneNumber } = require('libphonenumber-js')

const validatePhoneNumber = (value, helpers) => {
  if (!isValidPhoneNumber(value, 'GB')) {
    return helpers.message('Telephone number must be real')
  }

  return value
}

const ownerDetailsSchema = Joi.object({
  personReference: Joi.string().required(),
  firstName: Joi.string().trim().required().max(30).messages({
    'string.empty': 'Enter a first name',
    'string.max': 'First name must be no more than {#limit} characters'
  }),
  lastName: Joi.string().trim().required().max(24).messages({
    'string.empty': 'Enter a last name',
    'string.max': 'Last name must be no more than {#limit} characters'
  }),
  addressLine1: Joi.string().trim().required().max(50).messages({
    'string.empty': 'Enter first line of address',
    'string.max': 'First line of address must be no more than {#limit} characters'
  }),
  addressLine2: Joi.string().trim().allow(null).allow('').max(50).optional().messages({
    'string.max': 'Second line of address must be no more than {#limit} characters'
  }),
  town: Joi.string().trim().required().max(50).messages({
    'string.empty': 'Enter town or city',
    'string.max': 'Town or city must be no more than {#limit} characters'
  }),
  postcode: Joi.string().trim().required().max(8).regex(postcodeRegex).messages({
    'string.empty': 'Enter a postcode',
    'string.max': 'Postcode must be no more than {#limit} characters',
    'string.pattern.base': 'Postcode must be a real postcode'
  }),
  dateOfBirth: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).custom(validateOwnerDateOfBirth),
  email: Joi.string().email({ tlds: { allow: false } }).trim().max(254).optional().allow(null).allow('').messages({
    'string.max': 'Email must be no more than {#limit} characters',
    'string.email': 'Email address must be real'
  }),
  primaryTelephone: Joi.string().trim().optional().allow(null).allow('').custom(validatePhoneNumber),
  secondaryTelephone: Joi.string().trim().optional().allow(null).allow('').custom(validatePhoneNumber),
  country: Joi.string().trim().optional().allow(null).allow(''),
  submitButton: Joi.string().allow(null).allow('').optional()
}).required()

const validatePayload = (payload) => {
  payload.dateOfBirth = getDateComponents(payload, 'dateOfBirth')

  const schema = ownerDetailsSchema.concat(dateOfBirthSchema)

  const { value, error } = schema.validate(payload, { abortEarly: false })

  if (error) {
    throw error
  }

  return value
}

module.exports = {
  ownerDetailsSchema,
  validatePayload
}
