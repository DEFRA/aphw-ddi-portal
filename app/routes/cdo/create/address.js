const { routes, views } = require('../../../constants/cdo/owner')
const { routes: dogRoutes } = require('../../../constants/cdo/dog')
const { getAddress, setAddress } = require('../../../session/cdo/owner')
const ViewModel = require('../../../models/cdo/create/address')
const addressSchema = require('../../../schema/portal/owner/address')
const { anyLoggedInUser } = require('../../../auth/permissions')
const { setPoliceForce } = require('../../../lib/model-helpers')
const { getCountries } = require('../../../api/ddi-index-api')
const { logValidationError } = require('../../../lib/log-helpers')

const form = { formAction: routes.address.post }
const backNavStandard = { backLink: routes.postcodeLookupCreate.get }
const backNavSummary = { backLink: routes.fullSummary.get }

const getBackNav = request => {
  return request?.query?.fromSummary === 'true' ? backNavSummary : backNavStandard
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

      await setPoliceForce(request, request.payload?.postcode)

      return h.redirect(dogRoutes.microchipSearch.get)
    }
  }
}]
