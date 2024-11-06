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
  }).custom((value, helper) => validateDate(value, helper, false, false, true)).optional(),
  queryType: Joi.string().required(),
  pk: Joi.string()
    .when('queryType',
      { is: 'dog', then: Joi.string().required() })
    .concat(
      Joi.string().when('queryType',
        { is: 'owner', then: Joi.string().required() }))
    .concat(
      Joi.string().when('queryType',
        { is: 'search', then: Joi.string().required() }))
    .concat(
      Joi.string().when('queryType',
        { is: 'user', then: Joi.string().required() }))
    .concat(
      Joi.string().when('queryType',
        { is: 'date', then: Joi.string().allow('').allow(null).optional() }))
    .concat(
      Joi.string().when('queryType',
        { is: 'login', then: Joi.string().allow('').allow(null).optional() }))
    .messages({
      '*': 'Enter a value'
    })
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

  const { error, value } = schema.validate(payload, { abortEarly: false })

  if (error) {
    throw error
  }

  return value
}

module.exports = { validatePayload }
