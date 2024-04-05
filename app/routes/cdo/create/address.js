const { routes, views } = require('../../../constants/cdo/owner')
const { routes: dogRoutes } = require('../../../constants/cdo/dog')
const { getAddress, setAddress } = require('../../../session/cdo/owner')
const ViewModel = require('../../../models/cdo/create/address')
const addressSchema = require('../../../schema/portal/owner/address')
const { anyLoggedInUser } = require('../../../auth/permissions')
const { setPoliceForce } = require('../../../lib/model-helpers')
const { getCountries } = require('../../../api/ddi-index-api')

const form = { formAction: routes.address.post }
const backNav = { backLink: routes.postcodeLookupCreate.get }

module.exports = [{
  method: 'GET',
  path: routes.address.get,
  options: {
    auth: { scope: anyLoggedInUser },
    handler: async (request, h) => {
      const address = getAddress(request)

      const countries = await getCountries()

      return h.view(views.address, new ViewModel(address, form, backNav, countries))
    }
  }
},
{
  method: 'POST',
  path: routes.address.post,
  options: {
    validate: {
      options: {
        abortEarly: false
      },
      payload: addressSchema,
      failAction: async (request, h, error) => {
        console.log('Validation error in address create:', error)

        const address = { ...getAddress(request), ...request.payload }

        const countries = await getCountries()

        return h.view(views.address, new ViewModel(address, form, backNav, countries, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      setAddress(request, request.payload)

      await setPoliceForce(request, request.payload?.postcode)

      return h.redirect(dogRoutes.microchipSearch.get)
    }
  }
}]
