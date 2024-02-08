const Joi = require('joi')
const { routes, views } = require('../../../constants/cdo/owner')
const { routes: dogRoutes } = require('../../../constants/cdo/dog')
const { getPostcodeAddresses } = require('../../../api/os-places')
const { setAddress, getOwnerDetails, setEnforcementDetails, getEnforcementDetails } = require('../../../session/cdo/owner')
const ViewModel = require('../../../models/cdo/create/select-address')
const { admin } = require('../../../auth/permissions')
const { setInSession, getFromSession } = require('../../../session/session-wrapper')
const { lookupPoliceForceByPostcode } = require('../../../api/police-area')

module.exports = [
  {
    method: 'GET',
    path: routes.selectAddress.get,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const postcode = getOwnerDetails(request)?.postcode
        const houseNumber = getOwnerDetails(request)?.houseNumber
        const addresses = await getPostcodeAddresses(postcode ? postcode.toUpperCase() : '', houseNumber)

        setInSession(request, 'addresses', addresses)
        return h.view(views.selectAddress, new ViewModel(postcode, addresses))
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
          const postcode = getOwnerDetails(request)?.postcode
          const addresses = getFromSession(request, 'addresses')

          return h.view(views.selectAddress, new ViewModel(postcode, addresses, error)).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const selectedAddress = getFromSession(request, 'addresses')[request.payload.address]

        const address = {
          addressLine1: selectedAddress.addressLine1,
          addressLine2: selectedAddress.addressLine2,
          town: selectedAddress.addressTown,
          postcode: selectedAddress.addressPostcode,
          country: selectedAddress.addressCountry
        }

        setAddress(request, address)

        const enforcementDetails = getEnforcementDetails(request) || {}
        const policeForce = await lookupPoliceForceByPostcode(address.postcode)

        if (policeForce) {
          enforcementDetails.policeForce = policeForce.id
          setEnforcementDetails(request, enforcementDetails)
        }

        return h.redirect(dogRoutes.details.get)
      }
    }
  }
]
