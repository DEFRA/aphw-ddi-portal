const Joi = require('joi')

const validNewMicrochip = /^[0-9\s]+$/

const validateMicrochip = (value, helpers) => {
  let elemName = helpers.state.path[0]

  if (elemName?.length > 1) {
    elemName = elemName.substring(0, 1).toUpperCase() + elemName.substring(1)
  }

  if (!value.match(validNewMicrochip)) {
    return helpers.message('Microchip numbers can only contains numbers', { path: [elemName] })
  }

  return value
}

const schema = Joi.object({
  microchipNumber: Joi.string().trim().max(15).allow('').allow(null).optional().messages({
    'string.max': 'Microchip number must be no more than {#limit} characters'
  }).custom(validateMicrochip)
}).required()

const validatePayload = (payload) => {
  const { value, error } = schema.validate(payload, { abortEarly: false })

  if (error) {
    throw error
  }

  return value
}

module.exports = {
  validatePayload
}
