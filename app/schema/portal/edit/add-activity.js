const Joi = require('joi')

const addActivitySchema = Joi.object({
  indexNumber: Joi.string().required(),
  activityType: Joi.string().trim().required().messages({
    '*': 'Select an activity type'
  }),
  srcHashParam: Joi.string().optional().allow('').allow(null)
}).required()

const validatePayload = (payload) => {
  const { value, error } = addActivitySchema.validate(payload, { abortEarly: false })

  if (error) {
    throw error
  }

  return value
}

module.exports = {
  validatePayload
}
