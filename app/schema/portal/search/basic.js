const Joi = require('joi')

const validCharsRegex = /^[a-zA-Z0-9-.@_+~\s]+$/
const schema = Joi.object({
  searchTerms: Joi.string().trim().required().regex(validCharsRegex).max(100).messages({
    'string.empty': 'Enter search term(s)',
    'string.pattern.base': 'Enter only letters, numbers, spaces or symbols - . _ @ + ~'
  }),
  searchType: Joi.string().required().messages({
    '*': 'Select a search type'
  }),
  fuzzy: Joi.string()
}).required()

module.exports = schema
