const { routes, views } = require('../../../constants/cdo/owner')
const { anyLoggedInUser } = require('../../../auth/permissions.js')
const constants = require('../../../constants/forms')
const ViewModel = require('../../../models/cdo/common/postcode-lookup')
const { validatePayload } = require('../../../schema/portal/cdo/postcode-lookup')
const { getOwnerDetails, setOwnerDetails } = require('../../../session/cdo/owner')
const { getQueryString } = require('../../../lib/route-helpers')
const { isRouteFlagSet } = require('../../../session/routes')

const backNavStandard = { backLink: routes.ownerDetails.get }
const backNavAddOwner = { backLink: routes.selectOwner.get }
const getBackNav = request => {
  return isRouteFlagSet(request, constants.routeFlags.addOwner) ? backNavAddOwner : backNavStandard
}

module.exports = [
  {
    method: 'GET',
    path: `${routes.postcodeLookupCreate.get}`,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const details = getOwnerDetails(request)

        const data = {
          postcode: details?.postcode,
          houseNumber: details?.houseNumber,
          queryString: getQueryString(request)
        }

        return h.view(views.postcodeLookupCreate, new ViewModel(data, getBackNav(request)))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.postcodeLookupCreate.post}`,
    options: {
      auth: { scope: anyLoggedInUser },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          const payload = request.payload

          const data = {
            postcode: payload.postcode,
            houseNumber: payload.houseNumber,
            queryString: getQueryString(request)
          }

          return h.view(views.postcodeLookupCreate, new ViewModel(data, getBackNav(request), error)).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const payload = request.payload

        const ownerDetails = getOwnerDetails(request)
        setOwnerDetails(request, {
          ...ownerDetails,
          ...payload
        })

        return h.redirect(`${routes.selectAddress.get}`)
      }
    }
  }
]
