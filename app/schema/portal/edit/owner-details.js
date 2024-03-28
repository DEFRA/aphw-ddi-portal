const Joi = require('joi')
const { getDateComponents } = require('../../../lib/date-helpers')
const { validateOwnerDateOfBirth } = require('../../../lib/validation-helpers')
const { dateOfBirthSchema } = require('../common/components/date-of-birth')

const postcodeRegex = /^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i

const { isValidPhoneNumber } = require('libphonenumber-js')

const validatePhoneNumber = (value, helpers) => {
  if (!isValidPhoneNumber(value, 'GB')) {
    return helpers.message('Enter a real telephone number')
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
    'string.empty': 'Enter the first line of the address',
    'string.max': 'The first line of the address must be no more than {#limit} characters'
  }),
  addressLine2: Joi.string().trim().allow(null).allow('').max(50).optional().messages({
    'string.max': 'The second line of the address must be no more than {#limit} characters'
  }),
  town: Joi.string().trim().required().max(50).messages({
    'string.empty': 'Enter the town or city',
    'string.max': 'The town or city must be no more than {#limit} characters'
  }),
  postcode: Joi.string().trim().required().max(8).regex(postcodeRegex).messages({
    'string.empty': 'Enter a postcode',
    'string.max': 'Postcode must be no more than {#limit} characters',
    'string.pattern.base': 'Enter a real postcode'
  }),
  dateOfBirth: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).custom(validateOwnerDateOfBirth),
  email: Joi.string().email({ tlds: { allow: false } }).trim().max(254).optional().allow(null).allow('').messages({
    'string.max': 'Email must be no more than {#limit} characters',
    'string.email': 'Enter a real email address'
  }),
  primaryTelephone: Joi.string().trim().optional().allow(null).allow('').custom(validatePhoneNumber),
  secondaryTelephone: Joi.string().trim().optional().allow(null).allow('').custom(validatePhoneNumber),
  country: Joi.string().trim().optional().allow(null).allow('')
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
