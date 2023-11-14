const Joi = require('joi')
const sharedConfig = require('./shared-sb-config')

const schema = Joi.object({
  address: Joi.string(),
  type: Joi.string()
})

const config = {
  address: process.env.REGISTER_IMPORT_REQUEST_QUEUE,
  type: 'queue'
}

const result = schema.validate(config)

if (result.error) {
  throw new Error(`The import queue config is invalid. ${result.error.message}`)
}

module.exports = {
  importRequestQueue: {
    ...result.value,
    ...sharedConfig
  }
}
