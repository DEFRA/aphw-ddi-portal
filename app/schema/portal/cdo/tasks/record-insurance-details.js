const Joi = require('joi')
const { validateDate, getDateComponents } = require('../../../../lib/date-helpers')
const { validatePayloadBuilder } = require('../../../../schema/common/validatePayload')

const insuranceSchema = Joi.object({
  taskName: Joi.string().required(),
  insuranceCompany: Joi.string().required().messages({
    'string.empty': 'Select an insurance company'
  }),
  insuranceRenewal: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).required().custom((value, helper) => validateDate(value, helper, true, false, true))
    .messages({
      'any.required': 'Insurance renewal date is required'
    })
}).required()

const validatePayloadRecordInsuranceDetails = (payload) => {
  payload.insuranceRenewal = getDateComponents(payload, 'insuranceRenewal')

  const schema = Joi.object({
    'insuranceRenewal-year': Joi.number().allow(null).allow(''),
    'insuranceRenewal-month': Joi.number().allow(null).allow(''),
    'insuranceRenewal-day': Joi.number().allow(null).allow('')
  }).concat(insuranceSchema)

  return validatePayloadBuilder(schema)(payload)
}

module.exports = {
  validatePayloadRecordInsuranceDetails
}
