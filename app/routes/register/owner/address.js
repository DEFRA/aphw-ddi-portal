const { getOwner, setOwnerAddress } = require('../../../owner')

module.exports = [
  {
    method: 'GET',
    path: '/register/owner/address',
    handler: (request, h) => {
      const owner = getOwner(request.yar)

      return h.view('register/owner/address', {
        addressLine1: owner.address?.addressLine1,
        addressLine2: owner.address?.addressLine2,
        addressLine3: owner.address?.addressLine3,
        addressTown: owner.address?.town,
        addressCounty: owner.address?.county,
        addressPostcode: owner.address?.postcode,
      })
    }
  },
  {
    method: 'POST',
    path: '/register/owner/address',
    handler: (request, h) => {
      setOwnerAddress(request.yar, request.payload)

      return h.redirect('/register/owner/is-keeper')
    }
  },
]
