const Joi = require('joi')
const { validateDate, getDateComponents } = require('../../../../lib/date-helpers')

const baseSchema = Joi.object({
  fromDate: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).custom((value, helper) => validateDate(value, helper, false, true)).optional(),
  toDate: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).custom((value, helper) => validateDate(value, helper, false, false, true)).optional()
})

const validatePayload = (payload) => {
  payload.fromDate = getDateComponents(payload, 'fromDate')
  payload.toDate = getDateComponents(payload, 'toDate')

  const schema = Joi.object({
    'fromDate-year': Joi.number().allow(null).allow(''),
    'fromDate-month': Joi.number().allow(null).allow(''),
    'fromDate-day': Joi.number().allow(null).allow(''),
    'toDate-year': Joi.number().allow(null).allow(''),
    'toDate-month': Joi.number().allow(null).allow(''),
    'toDate-day': Joi.number().allow(null).allow('')
  }).concat(baseSchema)

  const { error, value } = schema.validate(payload)

  if (error) {
    throw error
  }

  return value
}

module.exports = { validatePayload }
