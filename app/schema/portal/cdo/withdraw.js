const Joi = require('joi')
const { validatePayloadBuilder } = require('../../common/validatePayload')
const { errorMessages } = require('../../error-messages')

const withdrawalPayloadSchema = Joi.object({
  indexNumber: Joi.string().required(),
  withdrawOption: Joi.string().allow('email', 'post').required(),
  email: Joi.string().email().optional().messages(errorMessages.email),
  updateEmail: Joi.boolean().default(false)
}).required()

const validateWithdrawal = validatePayloadBuilder(withdrawalPayloadSchema)

module.exports = {
  validateWithdrawal,
  withdrawalPayloadSchema
}
