const Joi = require('joi')

const schema = Joi.object({
  address: Joi.number()
}).required()

module.exports = schema
