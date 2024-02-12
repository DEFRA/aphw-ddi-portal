const Joi = require('joi')
const { getDateComponents, validateDate } = require('../../../lib/date-helpers')

const validateInsurance = (value, helpers) => {
  const companyPresent = value.insuranceCompany
  const renewalPresent = value.insuranceRenewal

  if (companyPresent && !renewalPresent) {
    return helpers.message('Enter an insurance renewal date', { path: ['insuranceRenewal', ['day', 'month', 'year']] })
  }

  if (!companyPresent && renewalPresent) {
    return helpers.message('Select an insurance company', { path: ['insuranceCompany'] })
  }

  return value
}

const optionalDate = (preventFutureDates) => {
  return Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).optional().custom((value, helper) => validateDate(value, helper, false, preventFutureDates))
}

const optionalDateWhenInterimOr2023 = (errorText, preventFutureDates) => {
  return Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).when('exemptionOrder', {
    is: 2023,
    then: Joi.optional(),
    otherwise: Joi.when('status', {
      is: 'Interim exempt',
      then: Joi.optional().allow(null).allow('').custom((value, helper) => validateDate(value, helper, false, preventFutureDates)),
      otherwise: Joi.required().custom((value, helper) => validateDate(value, helper, true, preventFutureDates))
    }).messages({
      'any.required': errorText
    })
  })
}

const exemptionDetailsSchema = Joi.object({
  indexNumber: Joi.string().required(),
  status: Joi.string().required(),
  certificateIssued: optionalDate(true),
  cdoIssued: optionalDateWhenInterimOr2023('Enter a CDO issued date', true),
  cdoExpiry: optionalDateWhenInterimOr2023('Enter a CDO expiry date', false),
  court: Joi.string().when('exemptionOrder', {
    is: 2023,
    then: Joi.optional().allow(null).allow(''),
    otherwise: Joi.when('status', {
      is: 'Interim exempt',
      then: Joi.optional().allow(null).allow(''),
      otherwise: Joi.required()
    }).messages({
      'string.empty': 'Select a court'
    })
  }),
  policeForce: Joi.string().required().messages({
    'string.empty': 'Select a police force'
  }),
  legislationOfficer: Joi.string().trim().allow('').optional().max(64).messages({
    'string.max': 'Dog legislation officer must be no more than {#limit} characters'
  }),
  applicationFeePaid: optionalDate(true),
  neuteringConfirmation: optionalDate(true),
  microchipVerification: optionalDate(true),
  joinedExemptionScheme: optionalDate(true),
  insuranceCompany: Joi.string().trim().allow(''),
  insuranceRenewal: optionalDate(false),
  exemptionOrder: Joi.number().required(),
  microchipDeadline: optionalDate(false),
  typedByDlo: optionalDate(true),
  withdrawn: optionalDate(true),
  removedFromCdoProcess: optionalDate(true)
}).custom(validateInsurance).required()

const validatePayload = (payload) => {
  payload.certificateIssued = getDateComponents(payload, 'certificateIssued')
  payload.applicationFeePaid = getDateComponents(payload, 'applicationFeePaid')
  payload.neuteringConfirmation = getDateComponents(payload, 'neuteringConfirmation')
  payload.microchipVerification = getDateComponents(payload, 'microchipVerification')
  payload.joinedExemptionScheme = getDateComponents(payload, 'joinedExemptionScheme')
  payload.insuranceRenewal = getDateComponents(payload, 'insuranceRenewal')
  payload.microchipDeadline = getDateComponents(payload, 'microchipDeadline')
  payload.typedByDlo = getDateComponents(payload, 'typedByDlo')
  payload.withdrawn = getDateComponents(payload, 'withdrawn')
  payload.removedFromCdoProcess = getDateComponents(payload, 'removedFromCdoProcess')

  if (payload.exemptionOrder !== 2023 && payload.exemptionOrder !== '2023') {
    payload.cdoIssued = getDateComponents(payload, 'cdoIssued')
    payload.cdoExpiry = getDateComponents(payload, 'cdoExpiry')
  }

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
    'insuranceRenewal-day': Joi.number().allow(null).allow(''),
    'microchipDeadline-year': Joi.number().allow(null).allow(''),
    'microchipDeadline-month': Joi.number().allow(null).allow(''),
    'microchipDeadline-day': Joi.number().allow(null).allow(''),
    'typedByDlo-year': Joi.number().allow(null).allow(''),
    'typedByDlo-month': Joi.number().allow(null).allow(''),
    'typedByDlo-day': Joi.number().allow(null).allow(''),
    'withdrawn-year': Joi.number().allow(null).allow(''),
    'withdrawn-month': Joi.number().allow(null).allow(''),
    'withdrawn-day': Joi.number().allow(null).allow(''),
    'removedFromCdoProcess-year': Joi.number().allow(null).allow(''),
    'removedFromCdoProcess-month': Joi.number().allow(null).allow(''),
    'removedFromCdoProcess-day': Joi.number().allow(null).allow('')
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
