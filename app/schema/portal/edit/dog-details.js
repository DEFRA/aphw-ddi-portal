const Joi = require('joi')
const { getDateComponents } = require('../../../lib/date-helpers')
const { validateDate } = require('../../../lib/date-helpers')

const validNewMicrochip = /^[0-9\s]+$/

const validateMicrochip = (value, helpers) => {
  let elemName = helpers.state.path[0]
  if (elemName?.length > 1) {
    elemName = elemName.substring(0, 1).toUpperCase() + elemName.substring(1)
  }
  // Compare new value against original to determine if already pre-populated in the DB
  // (old microchip numbers from legacy data can contain letters so don't validate against new rules)
  if (value === helpers.state.ancestors[0][`orig${elemName}`]) {
    return value
  }
  if (!value.match(validNewMicrochip)) {
    return helpers.message('Microchip numbers can only contains numbers', { path: [elemName] })
  }
  return value
}

const dogDetailsSchema = Joi.object({
  id: Joi.number().required(),
  indexNumber: Joi.string().required(),
  name: Joi.string().trim().max(32).allow('').allow(null).optional().messages({
    'string.max': 'Dog name must be no more than {#limit} characters'
  }),
  breed: Joi.string().trim().required().messages({
    '*': 'Breed type is required'
  }),
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
    'string.max': 'Microchip number must be no more than {#limit} characters'
  }).custom(validateMicrochip),
  microchipNumber2: Joi.string().trim().max(15).allow('').allow(null).optional().messages({
    'string.max': 'Microchip number 2 must be no more than {#limit} characters'
  }).custom(validateMicrochip),
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
  }).custom((value, helper) => validateDate(value, helper, false, true)).optional()
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
