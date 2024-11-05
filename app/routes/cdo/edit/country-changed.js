const { routes, views, keys } = require('../../../constants/cdo/owner')
const { anyLoggedInUser } = require('../../../auth/permissions.js')
const ViewModel = require('../../../models/cdo/edit/country-changed')
const { addBackNavigation } = require('../../../lib/back-helpers')
const { getFromSession } = require('../../../session/session-wrapper')

module.exports = [
  {
    method: 'GET',
    path: routes.countryChanged.get,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const details = getFromSession(request, keys.policeForceChangedResult)

        if (details?.country == null) {
          return h.response().code(404).takeover()
        }

        return h.view(views.countryChanged, new ViewModel(details))
      }
    }
  },
  {
    method: 'POST',
    path: routes.countryChanged.post,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const details = getFromSession(request, keys.policeForceChangedResult)

        if (details?.country == null) {
          return h.response().code(404).takeover()
        }

        const backNav = addBackNavigation(request)

        if (!details?.policeResult?.policeForceResult?.policeForceName) {
          return h.redirect(`${routes.policeForceNotFound.get}/${details?.personReference}`)
        }

        return h.redirect(`${routes.countryChangedInfo.get}${backNav.srcHashParam}`)
      }
    }
  }
]
