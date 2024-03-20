const Joi = require('joi')
const { validateCdoIssueDate, validateInterimExemptionDate } = require('../../../../lib/validation-helpers')

const applicationTypeSchemaElements = {
  applicationType: Joi.string().trim().required().messages({
    '*': 'Application type is required'
  }),
  cdoIssued: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).custom(validateCdoIssueDate),
  interimExemption: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).custom(validateInterimExemptionDate),
  cdoExpiry: Joi.date().iso().allow(null).allow('').optional()
}

module.exports = {
  applicationTypeSchemaElements
}
