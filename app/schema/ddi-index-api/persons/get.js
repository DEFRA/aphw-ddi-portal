const Joi = require('joi')
const { stripTimeFromUTC } = require('../../../lib/date-helpers')

const personsFilter = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  dateOfBirth: Joi.date().iso().allow(null).optional().custom((value) => {
    return stripTimeFromUTC(new Date(value))
  }),
  dobDay: Joi.number().optional().allow('').strip(),
  dobMonth: Joi.number().optional().allow('').strip(),
  dobYear: Joi.number().optional().allow('').strip()
})

module.exports = {
  personsFilter
}
