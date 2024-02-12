const Joi = require('joi')

const addActivitySchema = Joi.object({
  pk: Joi.string().required(),
  source: Joi.string().required(),
  activityType: Joi.string().trim().required().messages({
    '*': 'Select an activity type'
  }),
  srcHashParam: Joi.string().optional()
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
