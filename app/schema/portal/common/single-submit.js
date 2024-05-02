const Joi = require('joi')

const confirmFlowValidFields = (field) => {
  return Joi.object({
    [field]: Joi.any(),
    confirmation: Joi.any(),
    confirm: Joi.any()
  })
}

const isInputFieldInPayload = (field, fieldText) => {
  return Joi.object({
    [field]: Joi.string().required().messages({
      '*': `${fieldText} is required`
    })
  }).unknown(true)
}

const hasConfirmationFormBeenSubmitted = Joi.object({
  confirmation: Joi.boolean().valid(true).required()
}).unknown(true)

const hasAreYouSureRadioBeenSelected = Joi.object({
  confirm: Joi.boolean().truthy('Y').falsy('N').required().messages({
    '*': 'Select an option'
  })
}).unknown(true)

const duplicateEntrySchema = (field, fieldText) => {
  return Joi.object({
    [field]: Joi.any().forbidden().messages({
      'any.unknown': `This ${fieldText} is already in the Index`
    })
  }).unknown(true)
}

module.exports = {
  confirmFlowValidFields,
  hasAreYouSureRadioBeenSelected,
  isInputFieldInPayload,
  hasConfirmationFormBeenSubmitted,
  duplicateEntrySchema
}
