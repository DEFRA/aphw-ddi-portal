const Joi = require('joi')

const dateOfBirthSchema = Joi.object({
  'dateOfBirth-year': Joi.number().allow(null).allow(''),
  'dateOfBirth-month': Joi.number().allow(null).allow(''),
  'dateOfBirth-day': Joi.number().allow(null).allow('')
})

module.exports = {
  dateOfBirthSchema
}
