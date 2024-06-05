const Joi = require('joi')
const { stripTimeFromUTC } = require('../../../lib/date-helpers')

const personsFilter = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  orphaned: Joi.boolean().optional(),
  dateOfBirth: Joi.date().iso().empty(null).allow(null).optional().custom((value) => {
    return stripTimeFromUTC(new Date(value))
  }),
  dobDay: Joi.number().optional().allow('').strip(),
  dobMonth: Joi.number().optional().allow('').strip(),
  dobYear: Joi.number().optional().allow('').strip(),
  sortKey: Joi.string().allow('owner').optional(),
  sortOrder: Joi.string().allow('ASC', 'DESC').optional(),
  limit: Joi.number().optional()

}).or('firstName', 'orphaned')

module.exports = {
  personsFilter
}
