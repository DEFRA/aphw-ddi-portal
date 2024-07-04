const Joi = require('joi')
const { validateDate, getDateComponents } = require('../../../../lib/date-helpers')
const { validatePayloadBuilder } = require('../../../../schema/common/validatePayload')

const verificationDatesSchema = Joi.object({
  taskName: Joi.string().required(),
  microchipVerification: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).required().custom((value, helper) => validateDate(value, helper, true, true))
    .messages({
      'any.required': 'Microchip number verified date is required'
    }),
  neuteringConfirmation: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).required().custom((value, helper) => validateDate(value, helper, true, true))
    .messages({
      'any.required': 'Neutering verified date is required'
    })
})

const validateVerificationDates = (payload) => {
  payload.microchipVerification = getDateComponents(payload, 'microchipVerification')
  payload.neuteringConfirmation = getDateComponents(payload, 'neuteringConfirmation')

  const schema = Joi.object({
    'microchipVerification-year': Joi.number().allow(null).allow(''),
    'microchipVerification-month': Joi.number().allow(null).allow(''),
    'microchipVerification-day': Joi.number().allow(null).allow(''),
    'neuteringConfirmation-year': Joi.number().allow(null).allow(''),
    'neuteringConfirmation-month': Joi.number().allow(null).allow(''),
    'neuteringConfirmation-day': Joi.number().allow(null).allow('')
  }).concat(verificationDatesSchema)

  return validatePayloadBuilder(schema)(payload)
}

module.exports = {
  validateVerificationDates
}
