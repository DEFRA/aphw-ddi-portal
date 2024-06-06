const Joi = require('joi')

const orphanedOwnersQuerySchema = Joi.object({
  start: Joi.boolean(),
  sortOrder: Joi.string().valid('ASC', 'DESC').default('ASC'),
  sortKey: Joi.string().valid('owner', 'indexNumber', 'dateOfBirth', 'address', 'selected').default('owner')
})

module.exports = {
  orphanedOwnersQuerySchema
}
