const { admin } = require('../auth/permissions')

module.exports = {
  method: 'GET',
  path: '/view-registration',
  options: {
    auth: { scope: [admin] },
    handler: (request, h) => {
      return h.view('view-registration')
    }
  }
}
