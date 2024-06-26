const Joi = require('joi')

console.log('~~~~~~ Chris Debug ~~~~~~ Initialising Blob storage config blob.js')
// Define config schema
const schema = Joi.object({
  connectionString: Joi.string().when('useConnectionString', { is: true, then: Joi.required(), otherwise: Joi.allow('').optional() }),
  storageAccount: Joi.string().required(),
  registerContainer: Joi.string().required(),
  certificateContainer: Joi.string().required(),
  useConnectionString: Joi.boolean().default(false)
})

// Build config
const config = {
  connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  storageAccount: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  registerContainer: 'uploads',
  certificateContainer: 'certificates',
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

console.log('~~~~~~ Chris Debug ~~~~~~ Blog storage config initialised blob.js', '')
module.exports = result.value
