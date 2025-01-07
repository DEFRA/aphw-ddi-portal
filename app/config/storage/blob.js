const Joi = require('joi')

// Define config schema
const schema = Joi.object({
  connectionString: Joi.string().when('useConnectionString', { is: true, then: Joi.required(), otherwise: Joi.allow('').optional() }),
  storageAccount: Joi.string().required(),
  registerContainer: Joi.string().required(),
  certificateContainer: Joi.string().required(),
  attachmentsContainer: Joi.string().required(),
  useConnectionString: Joi.boolean().default(false)
})

// Build config
const config = {
  connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  storageAccount: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  registerContainer: 'uploads',
  certificateContainer: 'certificates',
  attachmentsContainer: 'attachments',
  useConnectionString: process.env.AZURE_STORAGE_USE_CONNECTION_STRING
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The blob storage config is invalid. ${result.error.message}`)
}

module.exports = result.value
