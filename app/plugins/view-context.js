const { serviceName } = require('../config')
const { captureSiteKey } = require('../config')

module.exports = {
  plugin: {
    name: 'view-context',
    register: (server, _) => {
      server.ext('onPreResponse', function (request, h) {
        const response = request.response

        if (response.variety === 'view') {
          const ctx = response.source.context || {}

          const serviceUrl = '/'

          ctx.captureSiteKey = captureSiteKey
          ctx.serviceName = serviceName
          ctx.serviceUrl = serviceUrl

          response.source.context = ctx
        }

        return h.continue
      })
    }
  }
}
