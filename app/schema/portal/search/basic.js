const Joi = require('joi')

const schema = Joi.object({
  searchTerms: Joi.string().trim().required().max(100).messages({
    'string.empty': 'Enter some search terms'
  }),
  searchType: Joi.string().required().messages({
    '*': 'Select a search type'
  })
}).required()

module.exports = schema
