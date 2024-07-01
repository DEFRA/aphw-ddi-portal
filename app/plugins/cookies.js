const config = require('../config').cookieOptions
const { getCurrentPolicy } = require('../cookies')

module.exports = {
  plugin: {
    name: 'cookies',
    register: (server, options) => {
      console.log('~~~~~~ Chris Debug ~~~~~~ plugins/cookies - registering cookies', '')
      server.state('cookies_policy', config)
      console.log('~~~~~~ Chris Debug ~~~~~~ plugins/cookies cookies_policy set', '')

      server.ext('onPreResponse', (request, h) => {
        console.log('~~~~~~ Chris Debug ~~~~~~ plugins/cookies onPreResponse', '')
        const statusCode = request.response.statusCode
        console.log('~~~~~~ Chris Debug ~~~~~~ plugins/cookies onPreResponse status', statusCode)
        console.log('~~~~~~ Chris Debug ~~~~~~ plugins/cookies onPreResponse variety', request.response.variety)
        if (request.response.variety === 'view' && statusCode !== 404 && statusCode !== 500 && request.response.source.manager._context) {
          console.log('~~~~~~ Chris Debug ~~~~~~ plugins/cookies getting cookiesPolicy', '')
          const cookiesPolicy = getCurrentPolicy(request, h)
          console.log('~~~~~~ Chris Debug ~~~~~~ plugins/cookies success getting cookiesPolicy', cookiesPolicy)
          request.response.source.manager._context.cookiesPolicy = cookiesPolicy
        }
        console.log('~~~~~~ Chris Debug ~~~~~~ plugins/cookies returning', '')
        return h.continue
      })
    }
  }
}
