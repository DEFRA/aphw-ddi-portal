const Joi = require('joi')
const { validatePayloadBuilder } = require('../common/validate')

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

const breachReasonSchema = Joi.object({
  dogBreaches: Joi.array().items(Joi.string()).single().min(1).required().messages({
    '*': 'Select all reasons the dog is in breach'

  }),
  indexNumber: Joi.string().required()
}).required()

const validateChangeStatusPayload = validatePayloadBuilder(changeStatusSchema)
const validateBreachReasonPayload = validatePayloadBuilder(breachReasonSchema)

module.exports = {
  validateChangeStatusPayload,
  validateBreachReasonPayload,
  duplicateMicrochipSchema
}
