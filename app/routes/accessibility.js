const { anyLoggedInUser } = require('../auth/permissions')

module.exports = {
  method: 'GET',
  path: '/accessibility',
  options: {
    auth: { scope: anyLoggedInUser },
    handler: async (_, h) => {
      return h.view('accessibility')
    }
  }
}
