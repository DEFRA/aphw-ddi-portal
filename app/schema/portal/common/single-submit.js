const Joi = require('joi')

const singleSubmitSchema = (field, fieldText) => {
  return Joi.object({
    [field]: Joi.string().required().messages({
      '*': `${fieldText} is required`
    })
  })
}

module.exports = {
  singleSubmitSchema
}
