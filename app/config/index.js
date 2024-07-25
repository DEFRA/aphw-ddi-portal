const Joi = require('joi')
const authConfig = require('./auth')
const blobConfig = require('./storage/blob')

// Define config schema
const schema = Joi.object({
  serviceName: Joi.string().default('Dangerous Dogs Index'),
  port: Joi.number().default(3001),
  env: Joi.string().valid('development', 'test', 'production').default('development'),
  useRedis: Joi.boolean().default(false),
  ddiIndexApi: {
    baseUrl: Joi.string().required()
  },
  ddiEventsApi: {
    baseUrl: Joi.string().required()
  },
  osPlacesApi: {
    baseUrl: Joi.string().default('https://api.os.uk/search/places/v1'),
    token: Joi.string().required()
  },
  policeApi: {
    baseUrl: Joi.string().default('https://data.police.uk/api')
  },
  cache: {
    expiresIn: Joi.number().default(1000 * 3600 * 24 * 3), // 3 days
    options: {
      host: Joi.string().default('redis-hostname.default'),
      partition: Joi.string().default('dangerous-dog-act-portal'),
      password: Joi.string().allow(''),
      port: Joi.number().default(6379),
      tls: Joi.object()
    }
  },
  cookie: {
    cookieNameCookiePolicy: Joi.string().default('dangerous_dog_act_portal_cookie_policy'),
    cookieNameSession: Joi.string().default('dangerous_dog_act_portal_session'),
    isSameSite: Joi.string().default('Lax'),
    isSecure: Joi.boolean().default(true),
    password: Joi.string().min(32).required(),
    ttl: Joi.number().default(1000 * 3600 * 24 * 3) // 3 days
  },
  cookieOptions: Joi.object({
    ttl: Joi.number().default(1000 * 60 * 60 * 24 * 365),
    isSameSite: Joi.string().valid('Lax').default('Lax'),
    encoding: Joi.string().valid('base64json').default('base64json'),
    isSecure: Joi.bool().default(true),
    isHttpOnly: Joi.bool().default(true),
    clearInvalid: Joi.bool().default(false),
    strictHeader: Joi.bool().default(true)
  })
})

// Build config
const config = {
  serviceName: process.env.SERVICE_NAME,
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  useRedis: process.env.NODE_ENV !== 'test',
  cache: {
    options: {
      host: process.env.REDIS_HOSTNAME,
      password: process.env.REDIS_PASSWORD,
      port: process.env.REDIS_PORT,
      tls: process.env.NODE_ENV === 'production' ? {} : undefined
    }
  },
  ddiIndexApi: {
    baseUrl: process.env.DDI_API_BASE_URL
  },
  ddiEventsApi: {
    baseUrl: process.env.DDI_EVENTS_BASE_URL
  },
  osPlacesApi: {
    baseUrl: process.env.OS_PLACES_API_BASE_URL,
    token: process.env.OS_PLACES_API_KEY
  },
  policeApi: {
    baseUrl: process.env.POLICE_API_BASE_URL
  },
  cookie: {
    cookieNameCookiePolicy: 'dangerous_dog_act_portal_cookie_policy',
    cookieNameSession: 'dangerous_dog_act_portal_session',
    isSameSite: 'Lax',
    isSecure: process.env.NODE_ENV === 'production',
    password: process.env.COOKIE_PASSWORD
  },
  cookieOptions: {
    ttl: process.env.COOKIE_TTL_IN_MILLIS,
    isSameSite: 'Lax',
    encoding: 'base64json',
    isSecure: process.env.NODE_ENV === 'production',
    isHttpOnly: true,
    clearInvalid: false,
    strictHeader: true
  }
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

// Use the joi validated value
const value = result.value

value.authConfig = authConfig
value.blobConfig = blobConfig

value.isDev = value.env === 'development'
value.isTest = value.env === 'test'
value.isProd = value.env === 'production'

value.catboxOptions = {
  host: value.redisHost,
  port: value.redisPort,
  password: value.redisPassword,
  tls: value.isProd ? {} : undefined,
  partition: value.redisPartition
}

module.exports = value
