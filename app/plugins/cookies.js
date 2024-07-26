const config = require('../config').cookieOptions
const { getCurrentPolicy } = require('../cookies')

module.exports = {
  plugin: {
    name: 'cookies',
    register: (server, options) => {
      server.state('cookies_policy', config)

      server.ext('onPreResponse', (request, h) => {
        const statusCode = request.response.statusCode
        console.log(`plugins/cookies request.path ${request.path} statusCode=${statusCode} variety=${request.response.variety}`)
        if (request.response.variety === 'view' && statusCode !== 404 && statusCode !== 500 && request.response.source.manager._context) {
          console.log('plugins/cookies getCurrentPolicy')
          const cookiesPolicy = getCurrentPolicy(request, h)
          request.response.source.manager._context.cookiesPolicy = cookiesPolicy
        }
        return h.continue
      })
    }
  }
}
