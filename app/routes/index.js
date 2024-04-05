const { anyLoggedInUser } = require('../auth/permissions')
const { clearCdo } = require('../session/cdo')

module.exports = {
  method: 'GET',
  path: '/',
  options: {
    auth: { scope: anyLoggedInUser },
    handler: (request, h) => {
      clearCdo(request)
      return h.view('index')
    }
  }
}
