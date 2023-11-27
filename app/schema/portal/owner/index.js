const Joi = require('joi')

const address = require('./address')
const phoneNumber = require('./phone-number')
const email = require('./email')

const schema = Joi.object({
  address,
  phoneNumber,
  email
})

module.exports = schema
