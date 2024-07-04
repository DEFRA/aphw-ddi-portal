const Joi = require('joi')
const { validateDate, getDateComponents } = require('../../../../lib/date-helpers')
const { validatePayloadBuilder } = require('../../../../schema/common/validatePayload')

const applicationFeeSchema = Joi.object({
  taskName: Joi.string().required(),
  applicationFeePaid: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).optional().custom((value, helper) => validateDate(value, helper, true, true))
    .required().messages({
      'any.required': 'Enter an application fee payment date'
    })
})

const validateApplicationFeePayment = (payload) => {
  payload.applicationFeePaid = getDateComponents(payload, 'applicationFeePaid')

  const schema = Joi.object({
    'applicationFeePaid-year': Joi.number().allow(null).allow(''),
    'applicationFeePaid-month': Joi.number().allow(null).allow(''),
    'applicationFeePaid-day': Joi.number().allow(null).allow('')
  }).concat(applicationFeeSchema)

  return validatePayloadBuilder(schema)(payload)
}

module.exports = {
  validateApplicationFeePayment
}
