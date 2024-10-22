const Joi = require('joi')
const { serviceName } = require('../constants/service-name')
const { DEVELOPMENT, TEST, PRODUCTION } = require('../constants/environments')

const schema = Joi.object({
  host: Joi.string(),
  port: Joi.number().integer().default(6379),
  password: Joi.string().allow(''),
  partition: Joi.string().default(serviceName),
  cacheName: Joi.string().default(serviceName),
  ttl: Joi.number().integer().default(1000 * 60 * 60 * 24), // 24 hours
  tls: Joi.object(),
  expiresIn: Joi.number().default(1000 * 60 * 60 * 24) // 24 hours
})

const config = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  partition: process.env.REDIS_PARTITION ?? process.env.SERVICE_NAME,
  cacheName: process.env.REDIS_CACHE_NAME ?? process.env.SERVICE_NAME,
  ttl: process.env.REDIS_TTL,
  tls: process.env.NODE_ENV === PRODUCTION ? {} : undefined
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The cache config is invalid. ${result.error.message}`)
}

const value = result.value

value.isDev = process.env.NODE_ENV === DEVELOPMENT
value.isTest = process.env.NODE_ENV === TEST
value.isProd = process.env.NODE_ENV === PRODUCTION

value.useRedis = !(value.host === undefined)

if (!value.useRedis) {
  console.info('Redis disabled, using in memory cache')
}

value.catboxOptions = value.useRedis
  ? {
      host: value.host,
      port: value.port,
      password: value.password,
      partition: value.partition,
      tls: value.isDev ? undefined : {}
    }
  : {}

value.catbox = value.useRedis ? require('@hapi/catbox-redis') : require('@hapi/catbox-memory')

/**
 * @type {{
 *   useRedis: boolean;
 *   catboxOptions: {} | { host: string; port: string, password: string, partition: string, tls: any};
 *   isDev: boolean;
 *   isTest: boolean;
 *   isProd: boolean;
 *   host: string;
 *   port:  string;
 *   password: string;
 *   partition: string;
 *   cacheName: string;
 *   ttl: string;
 *   tls?: any
 * }}
 */
module.exports = value
