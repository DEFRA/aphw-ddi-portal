const { serviceName } = require('../config')
const { getUser } = require('../auth')
const mapAuth = require('../auth/map-auth')

const logError = err => {
  console.log(`view-context err ${new Date()}`, err)
  throw err
}

module.exports = {
  plugin: {
    name: 'view-context',
    register: (server, _) => {
      server.ext('onPreResponse', function (request, h) {
        const response = request.response

        if (response.variety === 'view') {
          try {
            const ctx = response.source.context || {}

            const serviceUrl = '/'

            ctx.serviceName = serviceName
            ctx.serviceUrl = serviceUrl
            ctx.auth = mapAuth(request)
            ctx.user = getUser(request)

            response.source.context = ctx
          } catch (err) {
            logError(err)
          }
        }

        return h.continue
      })
    }
  },
  logError
}
