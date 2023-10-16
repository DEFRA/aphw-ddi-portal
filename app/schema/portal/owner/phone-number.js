const Joi = require('joi')
const { isValidPhoneNumber } = require('libphonenumber-js')

const validate = (phone, helper) => {
  if (!isValidPhoneNumber(phone, 'GB')) {
    return helper.message('Enter a telephone number in the correct format.')
  }

  return phone
}

const schema = Joi.string().trim().custom(validate).required()

module.exports = schema
