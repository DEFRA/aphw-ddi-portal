const Joi = require('joi')

const schema = Joi.object({
  owner: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    dateOfBirth: Joi.string().optional().allow('').allow(null),
    personReference: Joi.string().optional().allow('').allow(null),
    address: Joi.object({
      addressLine1: Joi.string().required(),
      addressLine2: Joi.string().optional().allow('').allow(null),
      town: Joi.string().required(),
      postcode: Joi.string().required(),
      country: Joi.string().optional().allow('').allow(null)
    }).required()
  }).required(),
  enforcementDetails: Joi.object({
    court: Joi.string().optional().allow('').allow(null),
    policeForce: Joi.string().required(),
    legislationOfficer: Joi.string().allow(null).allow('').optional()
  }).required(),
  dogs: Joi.array().items(Joi.object({
    breed: Joi.string().required(),
    name: Joi.string().optional().allow('').allow(null),
    applicationType: Joi.string().required(),
    cdoIssued: Joi.when('applicationType', { is: 'cdo', then: Joi.date().iso().required(), otherwise: Joi.optional() }),
    cdoExpiry: Joi.when('applicationType', { is: 'cdo', then: Joi.date().iso().required(), otherwise: Joi.optional() }),
    interimExemption: Joi.when('applicationType', { is: 'interim-exemption', then: Joi.date().iso().required(), otherwise: Joi.optional() })
  })).min(1).required()
})

module.exports = schema
