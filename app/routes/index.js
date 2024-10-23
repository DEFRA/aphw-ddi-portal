const { anyLoggedInUser } = require('../auth/permissions')

module.exports = {
  method: 'GET',
  path: '/',
  options: {
    auth: { scope: anyLoggedInUser },
    handler: (request, h) => {
      console.log('User agent:', request.headers['user-agent'])
      return h.view('index')
    }
  }
}
