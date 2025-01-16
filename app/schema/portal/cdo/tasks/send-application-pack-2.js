const Joi = require('joi')
const { validatePayloadBuilder } = require('../../../../schema/common/validatePayload')

const schema = Joi.object({
  taskName: Joi.string().required(),
  contact: Joi.string().messages({
    '*': 'Select an option'
  }).required(),
  email: Joi.alternatives().conditional('contact', {
    is: 'email',
    then: Joi.string().email().required(),
    otherwise: Joi.any()
  }),
  updateEmail: Joi.boolean().default(false)
})

const validateSendApplicationPack2 = (payload) => {
  return validatePayloadBuilder(schema)(payload)
}

module.exports = {
  validateSendApplicationPack2
}
