const Joi = require('joi')
const { getDateComponents, validateDate } = require('../../../lib/date-helpers')
const { validateMicrochip, validateBreedForCountry } = require('../../../lib/validation-helpers')

const dogDetailsSchema = Joi.object({
  id: Joi.number().required(),
  indexNumber: Joi.string().required(),
  name: Joi.string().trim().max(32).allow('').allow(null).optional().messages({
    'string.max': 'Dog name must be no more than {#limit} characters'
  }),
  breed: Joi.string().trim().required().messages({
    'any.required': 'Breed type is required'
  }).custom((value, helper) => validateBreedForCountry(value, helper)),
  colour: Joi.string().trim().max(50).allow('').allow(null).optional().messages({
    'string.max': 'Colour must be no more than {#limit} characters'
  }),
  sex: Joi.string().trim().optional().allow(null).allow('').messages({
    '*': 'Sex is required'
  }),
  dateOfBirth: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).custom((value, helper) => validateDate(value, helper, false, true)).optional(),
  dateOfDeath: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).custom((value, helper) => validateDate(value, helper, false, true)).optional(),
  tattoo: Joi.string().trim().max(8).allow('').allow(null).optional().messages({
    'string.max': 'Tattoo must be no more than {#limit} characters'
  }),
  microchipNumber: Joi.string().trim().max(15).allow('').allow(null).optional().messages({
    'string.max': 'Microchip numbers must be {#limit} numbers long'
  }).custom((value, helper) => validateMicrochip(value, helper, true)),
  microchipNumber2: Joi.string().trim().max(15).allow('').allow(null).optional().messages({
    'string.max': 'Microchip numbers must be {#limit} numbers long'
  }).custom((value, helper) => validateMicrochip(value, helper, true)),
  dateExported: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).custom((value, helper) => validateDate(value, helper, false, true)).optional(),
  dateStolen: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).custom((value, helper) => validateDate(value, helper, false, true)).optional(),
  dateUntraceable: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).custom((value, helper) => validateDate(value, helper, false, true)).optional(),
  country: Joi.string().allow(null).allow('').optional()
}).required()

const validatePayload = (payload) => {
  payload.dateOfBirth = getDateComponents(payload, 'dateOfBirth')
  payload.dateOfDeath = getDateComponents(payload, 'dateOfDeath')
  payload.dateExported = getDateComponents(payload, 'dateExported')
  payload.dateStolen = getDateComponents(payload, 'dateStolen')
  payload.dateUntraceable = getDateComponents(payload, 'dateUntraceable')

  const schema = Joi.object({
    'dateOfBirth-year': Joi.number().allow(null).allow(''),
    'dateOfBirth-month': Joi.number().allow(null).allow(''),
    'dateOfBirth-day': Joi.number().allow(null).allow(''),
    'dateOfDeath-year': Joi.number().allow(null).allow(''),
    'dateOfDeath-month': Joi.number().allow(null).allow(''),
    'dateOfDeath-day': Joi.number().allow(null).allow(''),
    'dateExported-year': Joi.number().allow(null).allow(''),
    'dateExported-month': Joi.number().allow(null).allow(''),
    'dateExported-day': Joi.number().allow(null).allow(''),
    'dateStolen-year': Joi.number().allow(null).allow(''),
    'dateStolen-month': Joi.number().allow(null).allow(''),
    'dateStolen-day': Joi.number().allow(null).allow(''),
    'dateUntraceable-year': Joi.number().allow(null).allow(''),
    'dateUntraceable-month': Joi.number().allow(null).allow(''),
    'dateUntraceable-day': Joi.number().allow(null).allow(''),
    origMicrochipNumber: Joi.string().allow(null).allow(''),
    origMicrochipNumber2: Joi.string().allow(null).allow('')
  }).concat(dogDetailsSchema)

  const { value, error } = schema.validate(payload, { abortEarly: false })

  if (error) {
    throw error
  }

  return value
}

module.exports = {
  dogDetailsSchema,
  validatePayload
}
