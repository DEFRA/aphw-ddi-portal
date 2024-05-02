const Joi = require('joi')

const confirmFlowValidFields = (field) => {
  return Joi.object({
    [field]: Joi.any(),
    deletePk: Joi.any(),
    confirmation: Joi.any(),
    confirm: Joi.any()
  })
}

const isInputFieldAndPkInPayload = (field, fieldText) => {
  return Joi.object({
    [field]: Joi.string().required().messages({
      '*': `${fieldText} is required`
    })
  }).unknown(true).concat(Joi.object({
    deletePk: Joi.number().required().messages({
      '*': `Please choose a valid ${fieldText.toLowerCase()}`
    })
  }).unknown(true))
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
  isInputFieldAndPkInPayload,
  notFoundSchema
}
