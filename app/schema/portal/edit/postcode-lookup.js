const Joi = require('joi')
const { postcodeValidation, houseNumberValidation, validatePayloadBuilder } = require('../common/postcode')

const schema = Joi.object({
  personReference: Joi.string().required(),
  postcode: postcodeValidation,
  houseNumber: houseNumberValidation,
  submitButton: Joi.string().allow(null).allow('').optional()
}).required()

const validatePayload = validatePayloadBuilder(schema)

module.exports = {
  validatePayload
}
