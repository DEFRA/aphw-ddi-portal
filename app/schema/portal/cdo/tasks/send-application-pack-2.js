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
  }).messages({
    'string.empty': 'Enter an email address',
    'any.required': 'Enter an email address',
    'string.email': 'Enter an email address in the correct format, like name@example.com'
  }),
  updateEmail: Joi.boolean().default(false)
})

const validateSendApplicationPack2 = (payload) => {
  return validatePayloadBuilder(schema)(payload)
}

module.exports = {
  sendApplicationPackPayloadSchema: schema,
  validateSendApplicationPack2
}
