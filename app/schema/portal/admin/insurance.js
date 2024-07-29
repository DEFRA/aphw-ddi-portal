const Joi = require('joi')
const { validatePayloadBuilder } = require('../common/postcode')

const schema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'Enter a name',
    'any.required': 'Enter a name'
  })
}).required()

const removeSchema = Joi.object({
  remove: Joi.number().required()
}).required()

const duplicateInsuranceCompanySchema = Joi.object({
  name: Joi.any().forbidden().messages({
    'any.unknown': 'The insurer name is already listed'
  })
}).required()

const validateInsurancePayload = validatePayloadBuilder(schema)

module.exports = {
  validateInsurancePayload,
  duplicateInsuranceCompanySchema,
  removeSchema
}
