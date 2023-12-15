const Joi = require('joi')

const schema = Joi.object({
  owner: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    dateOfBirth: Joi.string().optional().allow('').allow(null),
    address: Joi.object({
      addressLine1: Joi.string().required(),
      addressLine2: Joi.string().optional().allow('').allow(null),
      town: Joi.string().required(),
      postcode: Joi.string().required()
    }).required()
  }).required(),
  enforcementDetails: Joi.object({
    court: Joi.string().required(),
    policeForce: Joi.string().required(),
    legislationOfficer: Joi.string().allow(null).allow('').optional()
  }).required(),
  dogs: Joi.array().items(Joi.object({
    breed: Joi.string().required(),
    name: Joi.string().optional().allow('').allow(null),
    cdoIssued: Joi.date().iso().required(),
    cdoExpiry: Joi.date().iso().required()
  })).min(1).required()
})

module.exports = schema
