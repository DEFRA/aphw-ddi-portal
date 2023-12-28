const Joi = require('joi')
const { getDateComponents } = require('../../../lib/date-helpers')
const { UTCDate } = require('@date-fns/utc')
const { isValid, isFuture, parse } = require('date-fns')

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

const validateDate = (value, helpers, required) => {
  const { day, month, year } = value
  const dateComponents = { day, month, year }
  const invalidComponents = []

  const elementPath = helpers.state.path[0]

  for (const key in dateComponents) {
    if (!dateComponents[key]) {
      invalidComponents.push(key)
    }
  }

  if (invalidComponents.length === 0) {
    const dateString = `${year}-${month}-${day}`
    const date = parseDate(dateString)

    if (year.length !== 4) {
      return helpers.message('Enter 4-digit year', { path: [elementPath, ['year']] })
    }

    if (elementPath === 'cdoIssued' && isFuture(date)) {
      return helpers.message('Enter a date that is in the past', { path: ['cdoIssued', ['day', 'month', 'year']] })
    }

    if (!date) {
      return helpers.message('Enter a real date', { path: [elementPath, ['day', 'month', 'year']] })
    }

    return date
  }

  if (invalidComponents.length === 3) {
    if (required) {
      return helpers.error('any.required', { path: [elementPath, ['day']] })
    }

    return null
  }

  const errorMessage = `A date must include a ${invalidComponents.join(' and ')}`

  return helpers.message(errorMessage, { path: [elementPath, invalidComponents] })
}

const exemptionDetailsSchema = Joi.object({
  indexNumber: Joi.string().required(),
  status: Joi.string().required(),
  certificateIssued: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).optional().custom(validateDate),
  cdoIssued: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).custom((value, helper) => validateDate(value, helper, true)).required().messages({
    'any.required': 'Enter a CDO issued date'
  }),
  cdoExpiry: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).custom((value, helper) => validateDate(value, helper, true)).required().messages({
    'any.required': 'Enter a CDO expiry date'
  }),
  court: Joi.string().required().messages({
    'string.empty': 'Select a court'
  }),
  policeForce: Joi.string().required().messages({
    'string.empty': 'Select a police force'
  }),
  legislationOfficer: Joi.string().trim().allow('').optional().max(64).messages({
    'string.max': 'Dog legislation officer must be no more than {#limit} characters'
  }),
  applicationFeePaid: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).optional().custom(validateDate),
  neuteringConfirmation: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).optional().custom(validateDate),
  microchipVerification: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).optional().custom(validateDate),
  joinedExemptionScheme: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).optional().custom(validateDate),
  insuranceCompany: Joi.string().trim().allow('').optional(),
  insuranceRenewal: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).optional().custom(validateDate)
}).required()

const validatePayload = (payload) => {
  payload.certificateIssued = getDateComponents(payload, 'certificateIssued')
  payload.cdoIssued = getDateComponents(payload, 'cdoIssued')
  payload.cdoExpiry = getDateComponents(payload, 'cdoExpiry')
  payload.applicationFeePaid = getDateComponents(payload, 'applicationFeePaid')
  payload.neuteringConfirmation = getDateComponents(payload, 'neuteringConfirmation')
  payload.microchipVerification = getDateComponents(payload, 'microchipVerification')
  payload.joinedExemptionScheme = getDateComponents(payload, 'joinedExemptionScheme')
  payload.insuranceRenewal = getDateComponents(payload, 'insuranceRenewal')

  const schema = Joi.object({
    'certificateIssued-year': Joi.number().allow(null).allow(''),
    'certificateIssued-month': Joi.number().allow(null).allow(''),
    'certificateIssued-day': Joi.number().allow(null).allow(''),
    'cdoIssued-year': Joi.number().allow(null).allow(''),
    'cdoIssued-month': Joi.number().allow(null).allow(''),
    'cdoIssued-day': Joi.number().allow(null).allow(''),
    'cdoExpiry-year': Joi.number().allow(null).allow(''),
    'cdoExpiry-month': Joi.number().allow(null).allow(''),
    'cdoExpiry-day': Joi.number().allow(null).allow(''),
    'applicationFeePaid-year': Joi.number().allow(null).allow(''),
    'applicationFeePaid-month': Joi.number().allow(null).allow(''),
    'applicationFeePaid-day': Joi.number().allow(null).allow(''),
    'neuteringConfirmation-year': Joi.number().allow(null).allow(''),
    'neuteringConfirmation-month': Joi.number().allow(null).allow(''),
    'neuteringConfirmation-day': Joi.number().allow(null).allow(''),
    'microchipVerification-year': Joi.number().allow(null).allow(''),
    'microchipVerification-month': Joi.number().allow(null).allow(''),
    'microchipVerification-day': Joi.number().allow(null).allow(''),
    'joinedExemptionScheme-year': Joi.number().allow(null).allow(''),
    'joinedExemptionScheme-month': Joi.number().allow(null).allow(''),
    'joinedExemptionScheme-day': Joi.number().allow(null).allow(''),
    'insuranceRenewal-year': Joi.number().allow(null).allow(''),
    'insuranceRenewal-month': Joi.number().allow(null).allow(''),
    'insuranceRenewal-day': Joi.number().allow(null).allow('')
  }).concat(exemptionDetailsSchema)

  const { value, error } = schema.validate(payload, { abortEarly: false })

  if (error) {
    throw error
  }

  return value
}

module.exports = {
  exemptionDetailsSchema,
  validatePayload
}
