const config = require('../config').cookieOptions
const { getCurrentPolicy } = require('../cookies')

module.exports = {
  plugin: {
    name: 'cookies',
    register: (server, options) => {
      server.state('cookies_policy', config)

      server.ext('onPreResponse', (request, h) => {
        const statusCode = request.response.statusCode
        // console.log('DevDebug onPreResponse2 statusCode', statusCode)
        // console.log('DevDebug onPreResponse2 variety', request.response.variety)
        // console.log('DevDebug onPreResponse2 _context', request.yar.get('cookiesPolicy'))
        if (request.response.variety === 'view' && statusCode !== 404 && statusCode !== 500 && request.response.source.manager._context) {
          const cookiesPolicy = getCurrentPolicy(request, h)
          request.response.source.manager._context.cookiesPolicy = cookiesPolicy
        }
        return h.continue
      })
    }
  }
}
