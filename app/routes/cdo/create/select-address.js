const Joi = require('joi')
const { routes, views } = require('../../../constants/cdo/owner')
const { routes: dogRoutes } = require('../../../constants/cdo/dog')
const { getPostcodeAddresses } = require('../../../api/os-places')
const { setAddress, getOwnerDetails } = require('../../../session/cdo/owner')
const ViewModel = require('../../../models/cdo/create/select-address')
const { admin } = require('../../../auth/permissions')
const { setInSession, getFromSession } = require('../../../session/session-wrapper')
const { setPoliceForce } = require('../../../lib/model-helpers')

const source = 'create'

module.exports = [
  {
    method: 'GET',
    path: routes.selectAddress.get,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const details = getOwnerDetails(request) || {}
        details.source = source

        const postcode = details?.postcode
        const houseNumber = details?.houseNumber
        const addresses = await getPostcodeAddresses(postcode ? postcode.toUpperCase() : '', houseNumber)

        setInSession(request, 'addresses', addresses)

        if (addresses && addresses.length === 1) {
          setAddress(request, addresses[0])
        }

        return h.view(views.selectAddress, new ViewModel(details, addresses))
      }
    }
  },
  {
    method: 'POST',
    path: routes.selectAddress.post,
    options: {
      auth: { scope: [admin] },
      validate: {
        payload: Joi.object({
          address: Joi.number().min(0).required()
        }),
        failAction: async (request, h, error) => {
          const details = getOwnerDetails(request) || {}
          details.source = source

          const addresses = getFromSession(request, 'addresses')

          return h.view(views.selectAddress, new ViewModel(details, addresses, error)).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const selectedAddress = getFromSession(request, 'addresses')[request.payload.address]

        setAddress(request, selectedAddress)

        await setPoliceForce(request, selectedAddress.postcode)

        return h.redirect(dogRoutes.microchipSearch.get)
      }
    }
  }
]
