const Joi = require('joi')
const { validatePayloadBuilder } = require('../../../../schema/common/validatePayload')

const schema = Joi.object({
  taskName: Joi.string().required(),
  taskDone: Joi.string().messages({
    '*': 'Confirm the Form 2 has been sent'
  }).required()
})

const validateSendForm2 = (payload) => {
  return validatePayloadBuilder(schema)(payload)
}

module.exports = {
  validateSendForm2
}
