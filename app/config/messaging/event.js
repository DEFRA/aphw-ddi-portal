const Joi = require('joi')
const sharedConfig = require('./shared-sb-config')

const schema = Joi.object({
  address: Joi.string(),
  type: Joi.string()
})

const config = {
  address: process.env.EVENT_TOPIC_ADDRESS,
  type: 'Topic'
}

const result = schema.validate(config)

if (result.error) {
  throw new Error(`The import queue config is invalid. ${result.error.message}`)
}

module.exports = {
  event: {
    ...result.value,
    ...sharedConfig
  }
}
