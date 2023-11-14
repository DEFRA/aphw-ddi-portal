const Joi = require('joi')

const schema = Joi.object({
  host: Joi.string(),
  username: Joi.string(),
  password: Joi.string(),
  useCredentialChain: Joi.bool().default(false),
  appInsights: Joi.object()
})

const config = {
  host: process.env.MESSAGE_QUEUE_HOST,
  username: process.env.MESSAGE_QUEUE_USER,
  password: process.env.MESSAGE_QUEUE_PASSWORD,
  useCredentialChain: process.env.NODE_ENV === 'production',
  appInsights: require('applicationinsights')
}

const result = schema.validate(config)

if (result.error) {
  throw new Error(`The service bus config is invalid. ${result.error.message}`)
}

module.exports = result.value
