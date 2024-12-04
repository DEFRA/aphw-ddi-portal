const Joi = require('joi')
const { validateDate, getDateComponents } = require('../../../../lib/date-helpers')
const { validatePayloadBuilder } = require('../../../../schema/common/validatePayload')

const microchipVerification = Joi.object({
  year: Joi.string().allow(null).allow(''),
  month: Joi.string().allow(null).allow(''),
  day: Joi.string().allow(null).allow('')
}).required().custom((value, helper) => validateDate(value, helper, true, true))
  .messages({
    'any.required': 'Enter the date the dog’s microchip number was verified'
  })

const neuteringConfirmation = Joi.object({
  year: Joi.string().allow(null).allow(''),
  month: Joi.string().allow(null).allow(''),
  day: Joi.string().allow(null).allow('')
}).required().custom((value, helper) => validateDate(value, helper, true, true))
  .messages({
    'any.required': 'Enter the date the dog’s neutering was verified'
  })

const emptyDate = Joi.object({
  year: Joi.string().allow('').allow(null),
  month: Joi.string().allow('').allow(null),
  day: Joi.string().allow('').allow(null)
}).custom((value, helpers) => {
  const keys = ['year', 'month', 'day']
  const allValid = keys.every(key => value[key] === '')

  if (!allValid) {
    // Throw a single error if any key has an invalid value
    const elementPath = helpers.state.path[0]
    return helpers.message('custom', { path: [elementPath, ['day', 'month', 'year']] })
  }

  return value
})

const verificationDatesSchema = Joi.object({
  taskName: Joi.string().required(),
  dogNotFitForMicrochip: Joi.boolean().truthy('').default(false),
  dogNotNeutered: Joi.boolean().truthy('').default(false),
  microchipVerification: Joi.alternatives().conditional('dogNotFitForMicrochip', {
    is: true,
    then: emptyDate.messages({
      '*': 'Enter the date the dog’s microchip number was verified, or select ‘Dog declared unfit for microchipping by vet’'
    }),
    otherwise: microchipVerification
  }),
  neuteringConfirmation: Joi.alternatives().conditional('dogNotNeutered', {
    is: true,
    then: emptyDate.messages({
      '*': 'Enter the date the dog’s neutering was verified, or select ‘Dog aged under 16 months and not neutered’'
    }),
    otherwise: neuteringConfirmation
  })
})

const baseSchema = Joi.object({
  'microchipVerification-year': Joi.number().allow(null).allow(''),
  'microchipVerification-month': Joi.number().allow(null).allow(''),
  'microchipVerification-day': Joi.number().allow(null).allow(''),
  'neuteringConfirmation-year': Joi.number().allow(null).allow(''),
  'neuteringConfirmation-month': Joi.number().allow(null).allow(''),
  'neuteringConfirmation-day': Joi.number().allow(null).allow('')
})

const validateVerificationDates = (payload) => {
  payload.microchipVerification = getDateComponents(payload, 'microchipVerification')
  payload.neuteringConfirmation = getDateComponents(payload, 'neuteringConfirmation')

  const schema = baseSchema.concat(verificationDatesSchema)

  return validatePayloadBuilder(schema)(payload)
}

module.exports = {
  validateVerificationDates,
  microchipVerification,
  neuteringConfirmation,
  emptyDate,
  verificationDatesSchema
}
