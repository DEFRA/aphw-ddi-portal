const auth = require('../auth')

module.exports = {
  method: 'GET',
  path: '/logout',
  handler: async (request, h) => {
    request.auth?.credentials?.account && await auth.logout(request.auth.credentials.account)
    request.cookieAuth.clear()
    return h.redirect('/login')
  }
}
