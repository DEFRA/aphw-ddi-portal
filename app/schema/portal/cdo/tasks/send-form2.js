const Joi = require('joi')
const { validatePayloadBuilder } = require('../../../../schema/common/validatePayload')

const schema = Joi.object({
  taskName: Joi.string().required(),
  taskDone: Joi.string().messages({
    '*': 'Selection is required'
  }).required()
})

const validateSendForm2 = (payload) => {
  return validatePayloadBuilder(schema)(payload)
}

module.exports = {
  validateSendForm2
}
