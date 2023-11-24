const Joi = require('joi')

const schema = Joi.object({
  people: Joi.array().items(
    Joi.object({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      address: Joi.object({
        address_line_1: Joi.string().required(),
        address_line_2: Joi.string().allow(null).allow('').optional(),
        address_line_3: Joi.string().allow(null).allow('').optional(),
        postcode: Joi.string().required(),
        county: Joi.string().optional(),
        country: Joi.string().required()
      }),
      contacts: Joi.array().items(Joi.object({
        contact: Joi.string().required(),
        type: Joi.string().required()
      }).required())
    }).required())
}).required()

module.exports = schema
