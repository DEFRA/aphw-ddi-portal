const { anyLoggedInUser } = require('../auth/permissions')

module.exports = {
  method: 'GET',
  path: '/view-registration',
  options: {
    auth: { scope: anyLoggedInUser },
    handler: (request, h) => {
      return h.view('view-registration')
    }
  }
}
