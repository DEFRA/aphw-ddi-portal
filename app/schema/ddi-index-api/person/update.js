const Joi = require('joi')

const schema = Joi.object({
  personReference: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  dateOfBirth: Joi.date().iso().optional().allow('').allow(null),
  address: Joi.object({
    addressLine1: Joi.string().required(),
    addressLine2: Joi.string().optional().allow('').allow(null),
    town: Joi.string().required(),
    postcode: Joi.string().required(),
    country: Joi.string().optional().allow('').allow(null)
  }).required(),
  email: Joi.string().optional().allow('').allow(null),
  primaryTelephone: Joi.string().optional().allow('').allow(null),
  secondaryTelephone: Joi.string().optional().allow('').allow(null)
}).required()

module.exports = {
  schema
}
