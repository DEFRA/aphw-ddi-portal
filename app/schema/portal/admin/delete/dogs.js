const Joi = require('joi')

const deleteDogsQuerySchema1 = Joi.object({
  sortOrder: Joi.string().valid('ASC', 'DESC').optional(),
  sortKey: Joi.string().valid('status', 'indexNumber', 'cdoIssued', 'dateOfBirth', 'selected').optional(),
  start: Joi.string().optional(),
  today: Joi.string().optional()
})

const deleteDogsQuerySchema2 = Joi.object({
  sortOrder: Joi.string().valid('ASC', 'DESC').optional(),
  sortKey: Joi.string().valid('status', 'indexNumber', 'cdoIssued', 'dateOfBirth', 'selected').optional(),
  today: Joi.string().optional()
})

module.exports = {
  deleteDogsQuerySchema1,
  deleteDogsQuerySchema2
}
