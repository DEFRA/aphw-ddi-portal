const Joi = require('joi')

const confirmFlowValidFields = (field) => {
  return Joi.object({
    [field]: Joi.any(),
    pk: Joi.any(),
    confirmation: Joi.any(),
    confirm: Joi.any(),
    submitButton: Joi.string().allow(null).allow('').optional()
  })
}

const isInputFieldPkInPayload = (fieldText) => {
  const lowerFieldText = fieldText.toLowerCase()
  const article = 'the'
  return Joi.object({
    pk: Joi.number().required().messages({
      '*': `Enter ${article} ${lowerFieldText}`
    })
  }).unknown(true)
}

const areYouSureRemoveSchema = (field) => {
  return Joi.object({
    [field]: Joi.string().required(),
    pk: Joi.number().required(),
    confirm: Joi.boolean().truthy('Y').falsy('N').required().messages({
      '*': 'Select an option'
    })
  }).unknown(true)
}

const notFoundSchema = (field, fieldValue) => {
  return Joi.object({
    [field]: Joi.any().forbidden().messages({
      'any.unknown': `${fieldValue} does not exist in the index`
    })
  }).unknown(true)
}

module.exports = {
  confirmFlowValidFields,
  isInputFieldPkInPayload,
  areYouSureRemoveSchema,
  notFoundSchema
}
