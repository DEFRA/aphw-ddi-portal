const Joi = require('joi')

const deleteOwnersQuerySchema = Joi.object({
  sortOrder: Joi.string().valid('ASC', 'DESC').default('ASC'),
  sortKey: Joi.string().valid('name', 'indexNumber', 'dateOfBirth', 'address', 'selected').default('name')
})

module.exports = {
  deleteOwnersQuerySchema
}
