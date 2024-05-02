const Joi = require('joi')

const confirmFlowValidFields = (field) => {
  return Joi.object({
    [field]: Joi.any(),
    confirmation: Joi.any(),
    confirm: Joi.any()
  })
}

const isInputFieldPkInPayload = (field, fieldText) => {
  return Joi.object({
    [field]: Joi.number().required().messages({
      '*': `${fieldText} is required`
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
  notFoundSchema
}
