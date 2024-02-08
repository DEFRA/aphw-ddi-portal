const Joi = require('joi')
const { isFuture } = require('date-fns')
const { parseDate, getDateComponents } = require('../../../lib/date-helpers')

const validateDate = (value, helpers, required) => {
  const { day, month, year } = value
  const dateComponents = { day, month, year }
  const invalidComponents = []

  const elementPath = helpers.state.path[0]

  for (const key in dateComponents) {
    if (!dateComponents[key]) {
      invalidComponents.push(key)
    }
  }

  if (invalidComponents.length === 0) {
    const dateString = `${year}-${month}-${day}`
    const date = parseDate(dateString)

    if (year.length !== 4) {
      return helpers.message('Enter 4-digit year', { path: [elementPath, ['year']] })
    }

    if (elementPath === 'activityDate' && isFuture(date)) {
      return helpers.message('Enter a date that is not in the future', { path: ['activityDate', ['day', 'month', 'year']] })
    }

    if (!date) {
      return helpers.message('Enter a real date', { path: [elementPath, ['day', 'month', 'year']] })
    }

    return date
  }

  if (invalidComponents.length === 3) {
    if (required) {
      return helpers.error('any.required', { path: [elementPath, ['day']] })
    }

    return null
  }

  const errorMessage = `A date must include a ${invalidComponents.join(' and ')}`

  return helpers.message(errorMessage, { path: [elementPath, invalidComponents] })
}

const selectActivitySchema = Joi.object({
  indexNumber: Joi.string().required(),
  activityType: Joi.string().required(),
  activity: Joi.string().trim().required().messages({
    '*': 'Select an activity'
  }),
  activityDate: Joi.object({
    year: Joi.string().allow(null).allow('').optional(),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).optional().custom((value, helper) => validateDate(value, helper, true))
    .messages({
      'any.required': 'Enter a date'
    }),
  srcHashParam: Joi.string().optional().allow('').allow(null)
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
