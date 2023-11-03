const Joi = require('joi')

const schema = Joi.object({
  title: Joi.string().trim().required().messages({
    'string.empty': 'Enter the owner\'s title'
  }),
  firstName: Joi.string().trim().required().messages({
    'string.empty': 'Enter the owner\'s first name'
  }),
  lastName: Joi.string().trim().required().messages({
    'string.empty': 'Enter the owner\'s last name'
  })
}).required()

module.exports = schema
