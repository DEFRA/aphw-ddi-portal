const Joi = require('joi')

const cdoTasksGetSchema = Joi.object({
  dogIndex: Joi.string().required(),
  taskName: Joi.string().valid(
    'send-application-pack',
    'process-application-pack',
    'record-insurance-details',
    'record-microchip-number',
    'record-microchip-deadline',
    'record-application-fee-payment',
    'send-form2',
    'record-verification-dates').required()
})

module.exports = {
  cdoTasksGetSchema
}
