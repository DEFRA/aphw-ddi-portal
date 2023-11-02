const { admin } = require('../auth/permissions')

module.exports = {
  method: 'GET',
  path: '/capture-test',
  options: {
    auth: { scope: [admin] },
    handler: (request, h) => {
      return h.view('register/owner/_capture-test')
    }
  }
}
