const Joi = require('joi')
const { validateDate, getDateComponents } = require('../../../../lib/date-helpers')
const { validatePayloadBuilder } = require('../../../../schema/common/validatePayload')

const verificationDatesSchema = Joi.object({
  taskName: Joi.string().required(),
  microchipVerified: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).optional().custom((value, helper) => validateDate(value, helper, false, true)),
  neuteringVerified: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).optional().custom((value, helper) => validateDate(value, helper, false, true))
})

const validateVerificationDates = (payload) => {
  payload.microchipVerified = getDateComponents(payload, 'microchipVerified')
  payload.neuteringVerified = getDateComponents(payload, 'neuteringVerified')

  const schema = Joi.object({
    'microchipVerified-year': Joi.number().allow(null).allow(''),
    'microchipVerified-month': Joi.number().allow(null).allow(''),
    'microchipVerified-day': Joi.number().allow(null).allow(''),
    'neuteringVerified-year': Joi.number().allow(null).allow(''),
    'neuteringVerified-month': Joi.number().allow(null).allow(''),
    'neuteringVerified-day': Joi.number().allow(null).allow('')
  }).concat(verificationDatesSchema)

  return validatePayloadBuilder(schema)(payload)
}

module.exports = {
  validateVerificationDates
}
