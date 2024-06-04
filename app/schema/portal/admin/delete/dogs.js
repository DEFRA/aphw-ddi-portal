const Joi = require('joi')

const deleteDogsQuerySchema1 = Joi.object({
  sortOrder: Joi.string().valid('ASC', 'DESC').default('ASC'),
  sortKey: Joi.string().valid('status', 'indexNumber', 'cdoIssued', 'dateOfBirth', 'selected').default('status'),
  start: Joi.string().optional(),
  today: Joi.string().optional()
})

const deleteDogsQuerySchema2 = Joi.object({
  sortOrder: Joi.string().valid('ASC', 'DESC').default('ASC'),
  sortKey: Joi.string().valid('status', 'indexNumber', 'cdoIssued', 'dateOfBirth', 'selected').default('status'),
  today: Joi.string().optional()
})

module.exports = {
  deleteDogsQuerySchema1,
  deleteDogsQuerySchema2
}
