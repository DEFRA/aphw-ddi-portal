const Joi = require('joi')

const schema = Joi.array([
  Joi.object({
    title: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    address: Joi.object({
      address_line_1: Joi.string().required(),
      address_line_2: Joi.string(),
      address_line_3: Joi.string(),
      postcode: Joi.string().required(),
      county: Joi.string().required(),
      country: Joi.string().required()
    })
  })
])

module.exports = schema
