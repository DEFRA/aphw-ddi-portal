const Joi = require('joi')

const orphanedOwnersQuerySchema = Joi.object({
  start: Joi.boolean(),
  sortOrder: Joi.string().valid('ASC', 'DESC').default('ASC'),
  sortKey: Joi.string().valid('owner', 'indexNumber', 'dateOfBirth', 'address', 'selected').default('owner')
})

const orphanedOwnersPayloadSchema = Joi.object({
  deleteOwner: Joi.array().items(Joi.string()).single(),
  confirm: Joi.boolean().truthy('Y').default(false),
  checkboxSortOnly: Joi.any()
})

module.exports = {
  orphanedOwnersQuerySchema,
  orphanedOwnersPayloadSchema
}
