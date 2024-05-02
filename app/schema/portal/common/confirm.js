const Joi = require('joi')
const { validatePayloadBuilder } = require('../../common/validatePayload')

const schema = Joi.object({
  confirm: Joi.string().required().messages({
    '*': 'Select an option'
  }),
  pk: Joi.string().optional().allow('').allow(null)
}).required()

const validateSchemaPayload = validatePayloadBuilder(schema)

module.exports = {
  validatePayload: validateSchemaPayload
}
