const { admin } = require('../auth/permissions')
const { clearAllDogs } = require('../session/cdo/dog')
const { setOwnerDetails, setAddress, setEnforcementDetails } = require('../session/cdo/owner')

module.exports = {
  method: 'GET',
  path: '/',
  options: {
    auth: { scope: [admin] },
    handler: (request, h) => {
      clearAllDogs(request)
      setOwnerDetails(request, null)
      setAddress(request, null)
      setEnforcementDetails(request, null)
      return h.view('index')
    }
  }
}
