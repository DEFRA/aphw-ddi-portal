const Joi = require('joi')
const { validatePayloadBuilder } = require('../../../../schema/common/validatePayload')
const { errorMessages } = require('../../../error-messages')

const schema = Joi.object({
  taskName: Joi.string().required(),
  contact: Joi.string().messages({
    '*': 'Select how you want to send the application pack'
  }).required(),
  email: Joi.alternatives().conditional('contact', {
    is: 'email',
    then: Joi.string().email().required(),
    otherwise: Joi.any()
  }).messages(errorMessages.email),
  updateEmail: Joi.boolean().default(false)
})

const validateSendApplicationPack = (payload) => {
  return validatePayloadBuilder(schema)(payload)
}

module.exports = {
  sendApplicationPackPayloadSchema: schema,
  validateSendApplicationPack
}
