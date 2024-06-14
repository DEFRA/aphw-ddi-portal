const Joi = require('joi')

const changeStatusSchema = Joi.object({
  indexNumber: Joi.string().required(),
  newStatus: Joi.string().trim().required().messages({
    '*': 'Select a status'
  })
}).required()

const duplicateMicrochipSchema = Joi.object({
  indexNumber: Joi.string().forbidden().messages({
    '*': 'The microchip number is in use on another record.'
  }),
  newStatus: Joi.any()
}).required()

const validatePayload = (payload) => {
  const { value, error } = changeStatusSchema.validate(payload, { abortEarly: false })

  if (error) {
    throw error
  }

  return value
}

module.exports = {
  validatePayload,
  duplicateMicrochipSchema
}
