const Joi = require('joi')
const { validateMicrochip } = require('../../../../lib/validation-helpers')
const { validatePayloadBuilder } = require('../../../../schema/common/validatePayload')

const schema = Joi.object({
  taskName: Joi.string().required(),
  microchipNumber: Joi.string().trim().max(15).required().messages({
    'string.max': 'Microchip number must be {#limit} digits in length',
    'string.empty': 'Enter a microchip number'
  }).custom((value, helper) => validateMicrochip(value, helper, false))
})

const validateMicrochipNumber = payload => {
  return validatePayloadBuilder(schema)(payload)
}

module.exports = {
  validateMicrochipNumber
}
