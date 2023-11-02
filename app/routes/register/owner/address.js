const { getOwner, setOwnerAddress } = require('../../../owner')
const { admin } = require('../../../auth/permissions')

module.exports = [
  {
    method: 'GET',
    path: '/register/owner/address',
    options: {
      auth: { scope: [admin] },
      handler: (request, h) => {
        const owner = getOwner(request.yar)

        return h.view('register/owner/address', {
          addressLine1: owner.address?.addressLine1,
          addressLine2: owner.address?.addressLine2,
          addressLine3: owner.address?.addressLine3,
          addressTown: owner.address?.town,
          addressCounty: owner.address?.county,
          addressPostcode: owner.address?.postcode
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/register/owner/address',
    options: {
      auth: { scope: [admin] },
      handler: (request, h) => {
        setOwnerAddress(request.yar, request.payload)

        return h.redirect('/register/owner/is-keeper')
      }
    }
  }
]
