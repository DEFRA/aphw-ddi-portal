const Joi = require('joi')

const name = require('./name')
const address = require('./address')
const dateOfBirth = require('./date-of-birth')
const phoneNumber = require('./phone-number')
const email = require('./email')

const schema = Joi.object({
  name,
  address,
  dateOfBirth,
  phoneNumber,
  email
})

module.exports = schema
