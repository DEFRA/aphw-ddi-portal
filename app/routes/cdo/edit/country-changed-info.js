const { routes, views, keys } = require('../../../constants/cdo/owner')
const { anyLoggedInUser } = require('../../../auth/permissions.js')
const ViewModel = require('../../../models/cdo/edit/country-changed-info')
const { getMainReturnPoint, addBackNavigation } = require('../../../lib/back-helpers')
const { setInSession } = require('../../../session/session-wrapper')
const { setPostcodeLookupDetails } = require('../../../session/cdo/owner')

module.exports = [
  {
    method: 'GET',
    path: routes.countryChangedInfo.get,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const backNav = addBackNavigation(request)

        return h.view(views.countryChangedInfo, new ViewModel(backNav))
      }
    }
  },
  {
    method: 'POST',
    path: routes.countryChangedInfo.post,
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
