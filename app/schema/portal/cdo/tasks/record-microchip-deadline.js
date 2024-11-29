const Joi = require('joi')
const { validateDate, getDateComponents } = require('../../../../lib/date-helpers')
const { validatePayloadBuilder } = require('../../../../schema/common/validatePayload')

const neuteringConfirmation = Joi.object({
  year: Joi.string().allow(null).allow(''),
  month: Joi.string().allow(null).allow(''),
  day: Joi.string().allow(null).allow('')
}).required().custom((value, helper) => validateDate(value, helper, true, true))

const emptyDate = Joi.object({
  year: Joi.string().allow('').allow(null),
  month: Joi.string().allow('').allow(null),
  day: Joi.string().allow('').allow(null)
})

const microchipDeadlineSchema = Joi.object({
  taskName: Joi.string().required(),
  dogNotFitForMicrochip: Joi.boolean().truthy('').default(false),
  dogNotNeutered: Joi.boolean().truthy('').default(false),
  microchipDeadline: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).required().custom((value, helper) => validateDate(value, helper, true, false, true))
    .messages({
      'any.required': 'Enter the date the dog will be fit to be microchipped'
    }),
  microchipVerification: emptyDate,
  neuteringConfirmation: Joi.alternatives().conditional('dogNotNeutered', {
    is: true,
    then: emptyDate,
    otherwise: neuteringConfirmation
  })
})

const baseSchema = Joi.object({
  'microchipVerification-year': Joi.number().allow(null).allow(''),
  'microchipVerification-month': Joi.number().allow(null).allow(''),
  'microchipVerification-day': Joi.number().allow(null).allow(''),
  'neuteringConfirmation-year': Joi.number().allow(null).allow(''),
  'neuteringConfirmation-month': Joi.number().allow(null).allow(''),
  'neuteringConfirmation-day': Joi.number().allow(null).allow(''),
  'microchipDeadline-year': Joi.number().allow(null).allow(''),
  'microchipDeadline-month': Joi.number().allow(null).allow(''),
  'microchipDeadline-day': Joi.number().allow(null).allow('')
})

const validateMicrochipDeadlineDates = (payload) => {
  payload.microchipDeadline = getDateComponents(payload, 'microchipDeadline')
  payload.neuteringConfirmation = getDateComponents(payload, 'neuteringConfirmation')

  const schema = baseSchema.concat(microchipDeadlineSchema)

  return validatePayloadBuilder(schema)(payload)
}

module.exports = {
  validateMicrochipDeadlineDates
}
