const Joi = require('joi')

const address = require('./address')

const schema = Joi.object({
  address
})

module.exports = schema
