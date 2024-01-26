const Joi = require('joi')
const { getDateComponents } = require('../../../lib/date-helpers')
const { UTCDate } = require('@date-fns/utc')
const { isValid, isFuture, parse } = require('date-fns')

const validNewMicrochip = /^[0-9\s]+$/

const validDateFormats = [
  'yyyy-MM-dd',
  'yyyy-M-d'
]

const parseDate = (value) => {
  for (const fmt of validDateFormats) {
    const date = parse(value, fmt, new UTCDate())

    if (isValid(date)) {
      return date
    }
  }

  return null
}

const validateDate = (value, helpers) => {
  const elementPath = helpers.state.path[0]

  if (`${value.year}-${value.month}-${value.day}` === 'undefined-undefined-undefined' || `${value.year}-${value.month}-${value.day}` === '--') {
    return null
  }

  const { day, month, year } = value
  const dateComponents = { day, month, year }
  const invalidComponents = []

  for (const key in dateComponents) {
    if (!dateComponents[key]) {
      invalidComponents.push(key)
    }
  }

  if (invalidComponents.length === 0) {
    if (year.length !== 4) {
      return helpers.message('Enter a 4-digit year', { path: [elementPath, ['day', 'month', 'year']] })
    }

    const dateString = `${year}-${month}-${day}`
    const date = parseDate(dateString)

    if (!date) {
      return helpers.message('Enter a real date', { path: [elementPath, ['day', 'month', 'year']] })
    }

    if ((elementPath === 'dateOfDeath' || elementPath === 'dateOfBirth' || elementPath === 'dateStolen') && isFuture(date)) {
      return helpers.message('Enter a date that is in the past', { path: [elementPath, ['day', 'month', 'year']] })
    }

    return date
  }

  const errorMessage = `A date must include a ${invalidComponents.join(' and ')}`

  return helpers.message(errorMessage, { path: [elementPath, invalidComponents] })
}

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
  }).custom(validateDate),
  dateOfDeath: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).custom(validateDate).optional(),
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
  }).custom(validateDate).optional(),
  dateStolen: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).custom(validateDate).optional(),
  dateUntraceable: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).custom(validateDate).optional()
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
