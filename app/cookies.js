const config = require('./config').cookieOptions

const getCurrentPolicy = (request, h) => {
  let cookiesPolicy = request.state.cookies_policy
  if (!cookiesPolicy) {
    cookiesPolicy = createDefaultPolicy(h)
  }
  return cookiesPolicy
}

const createDefaultPolicy = (h) => {
  const cookiesPolicy = { confirmed: false, essential: true, analytics: false }
  h.state('cookies_policy', cookiesPolicy, config)

  return cookiesPolicy
}

const updatePolicy = (request, h, analytics) => {
  let cookiesPolicy = request.state.cookies_policy
  if (!cookiesPolicy) {
    cookiesPolicy = createDefaultPolicy(h)
  }

  cookiesPolicy.analytics = analytics
  cookiesPolicy.confirmed = true

  h.state('cookies_policy', cookiesPolicy, config)

  if (!analytics) {
    h.unstate('_ga')
    h.unstate('_gid')
  }
}

module.exports = {
  getCurrentPolicy,
  updatePolicy
}
