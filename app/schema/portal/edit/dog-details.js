const Joi = require('joi')
const { keys } = require('../../../constants/cdo/dog')
const { getDateComponents } = require('../../../lib/date-helpers')

const dogDetailsSchema = Joi.object({
  dogId: Joi.number().required(),
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
  }).optional(),
  dateOfDeath: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).optional(),
  tattoo: Joi.string().trim().max(8).allow('').allow(null).optional().messages({
    'string.max': 'Tattoo must be no more than {#limit} characters'
  }),
  microchipNumber: Joi.string().trim().max(8).allow('').allow(null).optional().messages({
    'string.max': 'Microchip number must be no more than {#limit} characters'
  }),
  microchipNumber2: Joi.string().trim().max(8).allow('').allow(null).optional().messages({
    'string.max': 'Microchip number 2 must be no more than {#limit} characters'
  }),
  dateExported: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).optional(),
  dateStolen: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).optional()
}).required()

const validatePayload = (payload) => {
  payload.dateOfBirth = getDateComponents(payload, keys.dateOfBirth)
  payload.dateOfDeath = getDateComponents(payload, keys.dateOfDeath)
  payload.dateExported = getDateComponents(payload, keys.dateExported)
  payload.dateStolen = getDateComponents(payload, keys.dateStolen)

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
    dogId: Joi.number().optional()
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
