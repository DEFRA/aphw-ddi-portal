const Joi = require('joi')

const singleSubmitSchema = (field, fieldText) => {
  return Joi.object({
    confirm: Joi.boolean().truthy('Y').falsy('N'),
    [field]: Joi.string().required().messages({
      '*': `${fieldText} is required`
    })
  })
}

module.exports = {
  singleSubmitSchema
}
