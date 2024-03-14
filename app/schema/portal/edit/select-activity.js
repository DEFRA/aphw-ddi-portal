const Joi = require('joi')
const { getDateComponents } = require('../../../lib/date-helpers')
const { validateDate } = require('../../../lib/date-helpers')

const selectActivitySchema = Joi.object({
  pk: Joi.string().required(),
  source: Joi.string().required(),
  activityType: Joi.string().required(),
  activity: Joi.string().trim().required().messages({
    '*': 'Select an activity'
  }),
  activityDate: Joi.object({
    year: Joi.string().allow(null).allow('').optional(),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).optional().custom((value, helper) => validateDate(value, helper, true, true))
    .messages({
      'any.required': 'Enter a date'
    }),
  titleReference: Joi.string().required(),
  skippedFirstPage: Joi.string().allow('').allow(null).optional()
}).required()

const validatePayload = (payload) => {
  const schema = Joi.object({
    'activityDate-year': Joi.number().allow(null).allow(''),
    'activityDate-month': Joi.number().allow(null).allow(''),
    'activityDate-day': Joi.number().allow(null).allow('')
  }).concat(selectActivitySchema)

  payload.activityDate = getDateComponents(payload, 'activityDate')

  const { value, error } = schema.validate(payload, { abortEarly: false })

  if (error) {
    throw error
  }

  return value
}

module.exports = {
  validatePayload
}
