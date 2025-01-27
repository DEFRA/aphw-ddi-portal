const Joi = require('joi')
const { validatePayloadBuilder } = require('../../common/validatePayload')
const { errorMessages } = require('../../error-messages')

const withdrawalPayloadSchema = Joi.object({
  indexNumber: Joi.string().required(),
  withdrawOption: Joi.string().allow('email', 'post').required(),
  updateEmail: Joi.boolean().default(false),
  email: Joi.alternatives().conditional('withdrawOption', {
    is: 'email',
    then: Joi.alternatives().conditional('updateEmail',
      {
        is: true,
        then: Joi.string().email().required(),
        otherwise: Joi.forbidden()
      }),
    otherwise: Joi.any()
  }).messages(errorMessages.email)
}).required()

const validateWithdrawal = validatePayloadBuilder(withdrawalPayloadSchema)

module.exports = {
  validateWithdrawal,
  withdrawalPayloadSchema
}
