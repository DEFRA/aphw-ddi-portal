const ViewModel = require('../models/cookie-policy')
const { updatePolicy } = require('../cookies')
const joi = require('joi')

module.exports = [{
  method: 'GET',
  path: '/cookies',
  handler: (request, h) => {
    return h.view('cookies/cookie-policy', new ViewModel(request.state.cookies_policy, request.query.updated))
  }
}, {
  method: 'POST',
  path: '/cookies',
  options: {
    plugins: {
      crumb: false
    },
    validate: {
      payload: joi.object({
        analytics: joi.boolean(),
        async: joi.boolean().default(false)
      })
    },
    handler: (request, h) => {
      updatePolicy(request, h, request.payload.analytics)
      if (request.payload.async) {
        return h.response('ok')
      }
      return h.redirect('/cookies?updated=true')
    }
  }
}]
