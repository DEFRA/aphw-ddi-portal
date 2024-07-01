const config = require('./config').cookieOptions

const getCurrentPolicy = (request, h) => {
  console.log('~~~~~~ Chris Debug ~~~~~~ getCurrentPolicy', '')
  let cookiesPolicy = request.state.cookies_policy
  if (!cookiesPolicy) {
    console.log('~~~~~~ Chris Debug ~~~~~~ getCurrentPolicy - creating default policy', '')
    cookiesPolicy = createDefaultPolicy(h)
    console.log('~~~~~~ Chris Debug ~~~~~~ getCurrentPolicy - created default policy', '')
  }
  return cookiesPolicy
}

const createDefaultPolicy = (h) => {
  console.log('~~~~~~ Chris Debug ~~~~~~ createDefaultPolicy', '')
  const cookiesPolicy = { confirmed: false, essential: true, analytics: false }
  h.state('cookies_policy', cookiesPolicy, config)
  console.log('~~~~~~ Chris Debug ~~~~~~ createDefaultPolicy - success', '')

  return cookiesPolicy
}

const updatePolicy = (request, h, analytics) => {
  console.log('~~~~~~ Chris Debug ~~~~~~ updatePolicy', '')
  let cookiesPolicy = request.state.cookies_policy
  if (!cookiesPolicy) {
    console.log('~~~~~~ Chris Debug ~~~~~~ updatePolicy - creating default policy', '')
    cookiesPolicy = createDefaultPolicy(h)
  }

  console.log('~~~~~~ Chris Debug ~~~~~~ updatePolicy - created default policy', '')

  cookiesPolicy.analytics = analytics
  cookiesPolicy.confirmed = true

  console.log('~~~~~~ Chris Debug ~~~~~~ updatePolicy - setting policy state', 'CookiesPolicy', cookiesPolicy)
  h.state('cookies_policy', cookiesPolicy, config)
  console.log('~~~~~~ Chris Debug ~~~~~~ updatePolicy - cookies_policy', '')

  if (!analytics) {
    console.log('~~~~~~ Chris Debug ~~~~~~ updatePolicy - unsetting _ga _gid', '')
    h.unstate('_ga')
    h.unstate('_gid')
    console.log('~~~~~~ Chris Debug ~~~~~~ updatePolicy - success unset', '')
  }
}

module.exports = {
  getCurrentPolicy,
  updatePolicy
}
