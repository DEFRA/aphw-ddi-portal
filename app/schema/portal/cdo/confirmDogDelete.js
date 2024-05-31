const Joi = require('joi')
const { validatePayloadBuilder } = require('../../common/validatePayload')

const schema = Joi.object({
  confirm: Joi.string().required().allow('Y', 'N').messages({
    '*': 'Select an option'
  }),
  ownerPk: Joi.string().optional(),
  pk: Joi.string().optional().allow('').allow(null),
  confirmOwner: Joi.string().optional().allow('Y', 'N'),
  ownerConfirmation: Joi.boolean().optional(),
  confirmation: Joi.boolean().optional()
}).required()

const confirmOwnerSchema = Joi.object({
  confirm: Joi.string().required().allow('Y', 'N'),
  ownerPk: Joi.string().required(),
  pk: Joi.string().required(),
  confirmOwner: Joi.string().required().allow('Y', 'N')
}).unknown(true)

const isSingleDogSchema = Joi.object({
  pk: Joi.string().required(),
  ownerPk: Joi.string().forbidden()
}).unknown(true)

const confirmOwnerRadioSchema = Joi.object({
  ownerConfirmation: Joi.boolean().valid(true).required()
}).unknown(true)

const completeOwnerSchema = Joi.object({
  confirmOwner: Joi.boolean().truthy('Y').falsy('N').required().messages({
    '*': 'Select an option'
  })
}).unknown(true)

const validateSchemaPayload = validatePayloadBuilder(schema)

const bypassSchemaForDeleteOnlyDog = (schema) => Joi.alternatives().try(isSingleDogSchema, schema)

module.exports = {
  validatePayload: validateSchemaPayload,
  confirmOwnerRadioSchema,
  isSingleDogSchema,
  confirmOwnerSchema,
  bypassSchemaForDeleteOnlyDog,
  completeOwnerSchema
}
