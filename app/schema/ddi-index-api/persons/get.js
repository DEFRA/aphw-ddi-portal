const Joi = require('joi')

const personsFilter = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  dateOfBirth: Joi.date().iso().allow(null).optional()
})

module.exports = {
  personsFilter
}
