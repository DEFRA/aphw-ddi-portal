const Joi = require('joi')
const { validateOwnerDateOfBirth } = require('../../../lib/validation-helpers')
const { getDateComponents } = require('../../../lib/date-helpers')

const postcodeRegex = /^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i

const ownerDetailsSchema = Joi.object({
  firstName: Joi.string().trim().required().max(30).messages({
    'string.empty': 'Enter a first name',
    'string.max': 'First name must be no more than {#limit} characters'
  }),
  lastName: Joi.string().trim().required().max(24).messages({
    'string.empty': 'Enter a last name',
    'string.max': 'Last name must be no more than {#limit} characters'
  }),
  dateOfBirth: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).custom(validateOwnerDateOfBirth),
  postcode: Joi.string().trim().max(8).regex(postcodeRegex).when('triggeredButton', {
    is: Joi.exist(),
    then: Joi.required().messages({
      'string.empty': 'Enter a postcode',
      'string.max': 'Postcode must be no more than {#limit} characters',
      'string.pattern.base': 'Enter a real postcode'
    }),
    otherwise: Joi.optional().allow('')
  }),
  houseNumber: Joi.string().trim().max(50).optional().allow('').messages({
    'string.max': 'Property name or number must be no more than {#limit} characters'
  }),
  triggeredButton: Joi.string().trim().optional().allow('')
}).required()

const dateOfBirthSchema = Joi.object({
  'dateOfBirth-year': Joi.number().allow(null).allow(''),
  'dateOfBirth-month': Joi.number().allow(null).allow(''),
  'dateOfBirth-day': Joi.number().allow(null).allow('')
})

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
