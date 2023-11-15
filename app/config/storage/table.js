const Joi = require('joi')

const schema = Joi.object({
  useConnectionString: Joi.bool().default(false),
  connectionString: Joi.string().when('useConnectionString', { is: true, then: Joi.required(), otherwise: Joi.allow('').optional() }),
  account: Joi.string().required(),
  registerImportTable: Joi.string().default('registerimports')
})

const config = {
  useConnectionString: process.env.AZURE_STORAGE_USE_CONNECTION_STRING,
  connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  account: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  registerImportTable: process.env.AZURE_STORAGE_REGISTER_IMPORT_TABLE
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The storage config is invalid. ${result.error.message}`)
}

module.exports = result.value