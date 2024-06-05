const Joi = require('joi')

const orphanedOwnersQuerySchema = Joi.object({
  sortOrder: Joi.string().valid('ASC', 'DESC').default('ASC'),
  sortKey: Joi.string().valid('name', 'indexNumber', 'dateOfBirth', 'address', 'selected').default('name')
})

module.exports = {
  orphanedOwnersQuerySchema
}
