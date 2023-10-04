const config = require('../config')

module.exports = {
  plugin: require('@hapi/yar'),
  options: {
    name: config.cookie.cookieNameSession,
    maxCookieSize: config.useRedis ? 0 : 1024, // Non-zero cookie size required when not using redis e.g for testing
    storeBlank: true,
    cache: {
      cache: config.cache.name,
      expiresIn: config.cache.expiresIn
    },
    cookieOptions: {
      isHttpOnly: true,
      isSameSite: config.cookie.isSameSite,
      isSecure: config.cookie.isSecure,
      password: config.cookie.password,
      ttl: config.cache.expiresIn
    }
  }
}
