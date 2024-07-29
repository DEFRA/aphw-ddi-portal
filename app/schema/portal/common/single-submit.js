const Joi = require('joi')

const confirmFlowValidFields = (field) => {
  return Joi.object({
    [field]: Joi.any(),
    confirmation: Joi.any(),
    confirm: Joi.any(),
    submitButton: Joi.string().allow(null).allow('').optional()
  })
}

const isInputFieldInPayload = (field, fieldText) => {
  const lowerFieldText = fieldText.toLowerCase()
  const article = lowerFieldText.startsWith('a') ? 'an' : 'a'
  return Joi.object({
    [field]: Joi.string().required().messages({
      '*': `Enter ${article} ${lowerFieldText}`
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
      'any.unknown': `This ${fieldText} is already listed`
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
