const Joi = require('joi')

const validCharsRegex = /^[a-zA-Z0-9-_\s]+$/
const schema = Joi.object({
  searchTerms: Joi.string().trim().required().regex(validCharsRegex).max(100).messages({
    'string.empty': 'Enter some search terms',
    'string.pattern.base': 'No symbols allowed other than spaces and hypens'
  }),
  searchType: Joi.string().required().messages({
    '*': 'Select a search type'
  })
}).required()

module.exports = schema
