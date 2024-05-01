const Joi = require('joi')

const singleSubmitSchema = (field, fieldText) => {
  return Joi.object({
    [field]: Joi.string().required().messages({
      '*': `${fieldText} is required`
    })
  })
}

const singleSubmitSchemaConfirm = (field) => {
  return Joi.object({
    confirmation: Joi.boolean(),
    confirm: Joi.boolean().truthy('Y').falsy('N').required().messages({
      '*': 'Select an option'
    }),
    [field]: Joi.string().required()
  })
}

module.exports = {
  singleSubmitSchemaConfirm,
  singleSubmitSchema
}
