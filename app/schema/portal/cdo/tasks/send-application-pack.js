const Joi = require('joi')
const { validatePayloadBuilder } = require('../../../../schema/common/validatePayload')

const schema = Joi.object({
  taskName: Joi.string().required(),
  taskDone: Joi.string().messages({
    '*': 'Confirm if you have sent the application pack before continuing.'
  }).required()
})

const validateSendApplicationPack = (payload) => {
  return validatePayloadBuilder(schema)(payload)
}

module.exports = {
  validateSendApplicationPack
}
