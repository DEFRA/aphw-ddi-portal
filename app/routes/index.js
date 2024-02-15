const { admin } = require('../auth/permissions')

module.exports = {
  method: 'GET',
  path: '/',
  options: {
    auth: { scope: [admin] },
    handler: (request, h) => {
      return h.view('index')
    }
  }
}
