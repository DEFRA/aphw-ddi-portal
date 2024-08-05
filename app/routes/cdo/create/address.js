const { routes, views } = require('../../../constants/cdo/owner')
const { routes: dogRoutes } = require('../../../constants/cdo/dog')
const { getAddress, setAddress } = require('../../../session/cdo/owner')
const ViewModel = require('../../../models/cdo/create/address')
const addressSchema = require('../../../schema/portal/owner/address')
const { anyLoggedInUser } = require('../../../auth/permissions')
const { setPoliceForce } = require('../../../lib/model-helpers')
const { getCountries } = require('../../../api/ddi-index-api')
const { logValidationError } = require('../../../lib/log-helpers')
const constants = require('../../../constants/forms')
const { isRouteFlagSet, setRouteFlag, clearRouteFlag } = require('../../../session/routes')

const form = { formAction: routes.address.post }
const backNavStandard = { backLink: routes.postcodeLookupCreate.get }
const backNavSummary = { backLink: routes.fullSummary.get }
const backNavAddOwner = { backLink: routes.selectOwner.get }

const getBackNav = request => {
  const standardOrAdd = isRouteFlagSet(request, constants.routeFlags.addOwner) ? backNavAddOwner : backNavStandard
  return request?.query?.fromSummary === 'true' ? backNavSummary : standardOrAdd
}

module.exports = [{
  method: 'GET',
  path: routes.address.get,
  options: {
    auth: { scope: anyLoggedInUser },
    handler: async (request, h) => {
      const address = getAddress(request)

      const countries = await getCountries()

      return h.view(views.address, new ViewModel(address, form, getBackNav(request), countries))
    }
  }
},
{
  method: 'POST',
  path: routes.address.post,
  options: {
    auth: { scope: anyLoggedInUser },
    validate: {
      options: {
        abortEarly: false
      },
      payload: addressSchema,
      failAction: async (request, h, error) => {
        logValidationError(error, routes.address.post)

        const address = { ...getAddress(request), ...request.payload }

        const countries = await getCountries()

        return h.view(views.address, new ViewModel(address, form, getBackNav(request), countries, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      setAddress(request, request.payload)
      setRouteFlag(request, constants.routeFlags.manualAddressEntry)
      clearRouteFlag(request, constants.routeFlags.postcodeLookup)

      await setPoliceForce(request, request.payload?.postcode)

      return h.redirect(dogRoutes.microchipSearch.get)
    }
  }
}]
