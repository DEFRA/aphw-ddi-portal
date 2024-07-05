const Joi = require('joi')
const { validatePayloadBuilder } = require('../../../../schema/common/validatePayload')

const schema = Joi.object({
  taskName: Joi.string().required(),
  taskDone: Joi.string().messages({
    '*': 'Confirm if you have sent the Form 2 before continuing.'
  }).required()
})

const validateSendForm2 = (payload) => {
  return validatePayloadBuilder(schema)(payload)
}

module.exports = {
  validateSendForm2
}
