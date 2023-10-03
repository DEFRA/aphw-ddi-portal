const config = require('../config')

module.exports = {
  plugin: require('@hapi/yar'),
  options: {
    name: config.cookie.cookieNameSession,
    maxCookieSize: 1024,
    cookieOptions: {
      isHttpOnly: true,
      isSameSite: config.cookie.isSameSite,
      isSecure: config.cookie.isSecure,
      password: config.cookie.password,
      ttl: config.cookie.ttl
    }
  }
}
