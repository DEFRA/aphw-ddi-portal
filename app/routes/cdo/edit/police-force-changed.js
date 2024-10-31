const { routes, views, keys } = require('../../../constants/cdo/owner')
const { anyLoggedInUser } = require('../../../auth/permissions.js')
const ViewModel = require('../../../models/cdo/edit/police-force-changed')
const { getMainReturnPoint } = require('../../../lib/back-helpers')
const { getFromSession, setInSession } = require('../../../session/session-wrapper')
const { setPostcodeLookupDetails } = require('../../../session/cdo/owner')

module.exports = [
  {
    method: 'GET',
    path: routes.policeForceChanged.get,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const policeForceResult = getFromSession(request, keys.policeForceChangedResult)

        if (policeForceResult?.policeForceName == null) {
          return h.response().code(404).takeover()
        }

        const breadcrumbLink = getMainReturnPoint(request)

        return h.view(views.policeForceChanged, new ViewModel(policeForceResult, breadcrumbLink))
      }
    }
  },
  {
    method: 'POST',
    path: routes.policeForceChanged.post,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        setInSession(request, keys.policeForceChangedResult, null)
        setPostcodeLookupDetails(request, null)
        setInSession(request, 'addresses', null)
        return h.redirect(getMainReturnPoint(request))
      }
    }
  }
]
