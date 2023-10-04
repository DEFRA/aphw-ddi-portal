const { getOwner, setOwnerAddress } = require('../../../owner')
const { getPostcodeAddresses } = require('../../../api/os-places')

module.exports = [
  {
    method: 'GET',
    path: '/register/owner/select-address',
    handler: async (request, h) => {
      const owner = getOwner(request.yar)

      const lookup = await getPostcodeAddresses(owner.address.postcode)
      
      request.yar.set('addresses', lookup)

      const addressResults = []

      lookup.forEach((address, index) => {
        addressResults.push({
          value: index,
          text: `${address.addressLine1}, ${address.addressTown}, ${address.addressPostcode}`
        })
      })

      return h.view('register/owner/select-address', {
        postcode: owner.address.postcode,
        addressResults
      })
    }
  },
  {
    method: 'POST',
    path: '/register/owner/select-address',
    handler: (request, h) => {
      const address = request.yar.get('addresses')[request.payload.address]

      setOwnerAddress(request.yar, address)

      return h.redirect('/register/owner/address')
    }
  },
]
