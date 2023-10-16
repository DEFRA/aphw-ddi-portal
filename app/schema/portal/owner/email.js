const Joi = require('joi')

const schema = Joi.string().email({ tlds: { allow: false } }).required()

module.exports = schema
