const Joi = require('joi')

const validCharsRegex = /^[a-zA-Z0-9-.@_\s]+$/
const schema = Joi.object({
  searchTerms: Joi.string().trim().required().regex(validCharsRegex).max(100).messages({
    'string.empty': 'Enter search term(s)',
    'string.pattern.base': 'Only the following symbols are allowed . @ - _'
  }),
  searchType: Joi.string().required().messages({
    '*': 'Select a search type'
  })
}).required()

module.exports = schema
