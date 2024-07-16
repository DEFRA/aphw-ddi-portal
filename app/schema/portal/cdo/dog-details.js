const Joi = require('joi')
const { getDateComponents } = require('../../../lib/date-helpers')
const { calculateCdoExpiryDate, validateBreedForCountry } = require('../../../lib/validation-helpers')
const { applicationTypeSchemaElements } = require('../common/components/application-type')

const dogDetailsSchema = Joi.object({
  breed: Joi.string().trim().required().messages({
    'any.required': 'Breed type is required'
  }).custom((value, helper) => validateBreedForCountry(value, helper)),
  name: Joi.string().trim().max(32).allow('').allow(null).optional().messages({
    'string.max': 'Dog name must be no more than {#limit} characters'
  }),
  ...applicationTypeSchemaElements,
  microchipNumber: Joi.string().allow(null).allow('').optional(),
  country: Joi.string().allow(null).allow('').optional()
}).required()

const validatePayload = (payload) => {
  payload.cdoIssued = getDateComponents(payload, 'cdoIssued')
  payload.cdoExpiry = calculateCdoExpiryDate(payload.cdoIssued)
  payload.interimExemption = getDateComponents(payload, 'interimExemption')

  const schema = Joi.object({
    'cdoIssued-year': Joi.number().allow(null).allow(''),
    'cdoIssued-month': Joi.number().allow(null).allow(''),
    'cdoIssued-day': Joi.number().allow(null).allow(''),
    dogId: Joi.number().optional(),
    'interimExemption-year': Joi.number().allow(null).allow(''),
    'interimExemption-month': Joi.number().allow(null).allow(''),
    'interimExemption-day': Joi.number().allow(null).allow('')
  }).concat(dogDetailsSchema)

  const { value, error } = schema.validate(payload, { abortEarly: false })

  if (error) {
    throw error
  }

  return value
}

/**
 * @param {string[]} disallowedMicrochipIds
 * @return {Joi.ObjectSchema<any>}
 */
const microchipValidation = (disallowedMicrochipIds) => Joi.object({
  microchipNumber: Joi.string().optional().allow('').allow(null).disallow(...disallowedMicrochipIds).messages({
    '*': 'The microchip number already exists'
  }),
  microchipNumber2: Joi.string().optional().allow('').allow(null).disallow(...disallowedMicrochipIds).messages({
    '*': 'The microchip number already exists'
  })
})

module.exports = {
  dogDetailsSchema,
  validatePayload,
  microchipValidation
}
