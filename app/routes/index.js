const { anyLoggedInUser } = require('../auth/permissions')

module.exports = {
  method: 'GET',
  path: '/',
  options: {
    auth: { scope: anyLoggedInUser },
    handler: (request, h) => {
      return h.view('index')
    }
  }
}
