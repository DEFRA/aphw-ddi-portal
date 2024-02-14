const { admin } = require('../auth/permissions')
const { setActivityDetails } = require('../session/cdo/activity')

module.exports = {
  method: 'GET',
  path: '/',
  options: {
    auth: { scope: [admin] },
    handler: (request, h) => {
      setActivityDetails(request, null)
      return h.view('index')
    }
  }
}
