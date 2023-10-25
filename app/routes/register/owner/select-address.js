const Joi = require('joi')
const { routes, views } = require('../../../constants/owner')
const { getPostcodeAddresses } = require('../../../api/os-places')
const { getAddress, setAddress, getAddressPostcode } = require('../../../session/register/owner')
const ViewModel = require('../../../models/register/owner/select-address')

module.exports = [
  {
    method: 'GET',
    path: routes.selectAddress.get,
    handler: async (request, h) => {
      const postcode = getAddressPostcode(request)

      const addresses = await getPostcodeAddresses(postcode)

      request.yar.set('addresses', addresses)

      return h.view(views.selectAddress, new ViewModel(postcode, addresses))
    }
  },
  {
    method: 'POST',
    path: routes.selectAddress.post,
    options: {
      validate: {
        payload: Joi.object({
          address: Joi.number().min(0).required()
        }),
        failAction: async (request, h, error) => {
          const postcode = getAddressPostcode(request)
          const addresses = request.yar.get('addresses')

          return h.view(views.selectAddress, new ViewModel(postcode, addresses, error)).code(400).takeover()
        }
      },
      handler: (request, h) => {
        const selectedAddress = request.yar.get('addresses')[request.payload.address]

        const address = {
          addressLine1: selectedAddress.addressLine1,
          addressLine2: selectedAddress.addressLine2,
          town: selectedAddress.addressTown,
          county: selectedAddress.addressCounty,
          postcode: selectedAddress.addressPostcode
        }

        setAddress(request, address)

        return h.redirect(routes.address.get)
      }
    }
  }
]
