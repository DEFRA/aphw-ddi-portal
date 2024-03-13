const Joi = require('joi')
const { postcodeValidation, houseNumberValidation, validatePayloadBuilder } = require('../common/postcode')

const schema = Joi.object({
  postcode: postcodeValidation,
  houseNumber: houseNumberValidation
}).required()

const validatePayload = validatePayloadBuilder(schema)

module.exports = {
  validatePayload
}
