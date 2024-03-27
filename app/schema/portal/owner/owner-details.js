const Joi = require('joi')
const { validateOwnerDateOfBirth } = require('../../../lib/validation-helpers')
const { getDateComponents } = require('../../../lib/date-helpers')
const { dateOfBirthSchema } = require('../common/components/date-of-birth')

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
  }).custom(validateOwnerDateOfBirth)
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
