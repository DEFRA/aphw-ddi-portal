const config = require('../config')

module.exports = [{
  method: 'GET',
  path: '/assets/{path*}',
  options: {
    auth: false,
    handler: {
      directory: {
        path: [
          'node_modules/govuk-frontend/dist/govuk/assets'
        ]
      }
    },
    cache: {
      expiresIn: config.staticCacheTimeoutMillis,
      privacy: 'private'
    }
  }
}, {
  method: 'GET',
  path: '/govuk-frontend/dist/govuk/{path*}',
  options: {
    auth: false,
    handler: {
      directory: {
        path: [
          'node_modules/govuk-frontend/dist/govuk'
        ]
      }
    },
    cache: {
      expiresIn: config.staticCacheTimeoutMillis,
      privacy: 'private'
    }
  }
}, {
  method: 'GET',
  path: '/static/{path*}',
  options: {
    auth: false,
    handler: {
      directory: {
        path: [
          'app/dist',
          'node_modules/govuk-frontend/dist/govuk/assets'
        ]
      }
    },
    cache: {
      expiresIn: config.staticCacheTimeoutMillis,
      privacy: 'private'
    }
  }
}]
