const Joi = require('joi')

const schema = Joi.object({
  username: Joi.string().required(),
  pseudonym: Joi.string().required()
})

module.exports = schema
