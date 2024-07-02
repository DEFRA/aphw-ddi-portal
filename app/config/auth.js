const Joi = require('joi')

// Define config schema
const schema = Joi.object({
  enabled: Joi.boolean().default(false),
  azure: Joi.object({
    clientSecret: Joi.string().allow(''),
    clientId: Joi.string().allow(''),
    authority: Joi.string().allow('')
  }),
  cookie: Joi.object({
    password: Joi.string().required(),
    ttl: Joi.number().default(60 * 60 * 1000)
  }),
  redirectUrl: Joi.string().default('http://localhost:3002/authenticate')
})

// Build config
const config = {
  enabled: process.env.AUTHENTICATION_ENABLED,
  azure: {
    clientSecret: process.env.AZUREID_CLIENT_SECRET,
    clientId: process.env.AZUREID_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.AZUREID_TENANT_ID}`
  },
  cookie: {
    password: process.env.COOKIE_PASSWORD,
    ttl: process.env.COOKIE_TTL
  },
  redirectUrl: process.env.REDIRECT_URL?.length > 0 ? process.env.REDIRECT_URL : 'http://localhost:3002/authenticate'
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The auth config is invalid. ${result.error.message}`)
}

module.exports = result.value
