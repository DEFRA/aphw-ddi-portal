const Joi = require('joi')
const { validatePayloadBuilder } = require('../../../../schema/common/validatePayload')

const schema = Joi.object({
  taskName: Joi.string().required(),
  taskDone: Joi.string().messages({
    '*': 'Confirm you have processed the application'
  }).required()
})

const validateProcessApplicationPack = (payload) => {
  return validatePayloadBuilder(schema)(payload)
}

module.exports = {
  validateProcessApplicationPack
}
