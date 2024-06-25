const Joi = require('joi')
const { validateDate, getDateComponents } = require('../../../../lib/date-helpers')
const { validatePayloadBuilder } = require('../../../../schema/common/validatePayload')
const { validateInsurance } = require('../../../../schema/portal/edit/exemption-details')

const insuranceSchema = Joi.object({
  taskName: Joi.string().required(),
  insuranceCompany: Joi.string().trim().allow(''),
  insuranceRenewal: Joi.object({
    year: Joi.string().allow(null).allow(''),
    month: Joi.string().allow(null).allow(''),
    day: Joi.string().allow(null).allow('')
  }).required().custom((value, helper) => validateDate(value, helper, false, false))
}).custom(validateInsurance).required()

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
