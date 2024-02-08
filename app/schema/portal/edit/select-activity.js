const Joi = require('joi')

const selectActivitySchema = Joi.object({
  indexNumber: Joi.string().required(),
  activityType: Joi.string().required(),
  activity: Joi.string().trim().required().messages({
    '*': 'Select an activity'
  }),
  srcHashParam: Joi.string().optional().allow('').allow(null)
}).required()

const validatePayload = (payload) => {
  const { value, error } = selectActivitySchema.validate(payload, { abortEarly: false })

  if (error) {
    throw error
  }

  return value
}

module.exports = {
  validatePayload
}
