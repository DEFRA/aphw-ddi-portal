const config = require('./config')
const Hapi = require('@hapi/hapi')

const createServer = async () => {
  const server = Hapi.Server({
    port: config.port,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    },
    cache: [{
      name: config.cacheConfig.cacheName,
      provider: {
        constructor: config.cacheConfig.catbox,
        options: config.cacheConfig.catboxOptions
      }
    }],
    router: {
      stripTrailingSlash: true
    }
  })

  server.app.cache = server.cache({ cache: config.cacheConfig.cacheName, segment: 'auth', expiresIn: config.cacheConfig.ttl })

  await server.register(require('./plugins/auth'))
  await server.register(require('@hapi/inert'))
  await server.register(require('./plugins/router'))
  await server.register(require('./plugins/views'))
  await server.register(require('./plugins/view-context'))
  await server.register(require('./plugins/cookies.js'))
  await server.register(require('./plugins/session-cache'))
  await server.register(require('./plugins/logging'))
  await server.register(require('./plugins/error-pages'))

  return server
}

module.exports = createServer
