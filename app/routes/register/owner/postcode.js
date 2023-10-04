const { getOwner, setOwnerPostcode } = require('../../../owner')

module.exports = [
  {
    method: 'GET',
    path: '/register/owner/postcode',
    handler: (request, h) => {
      const owner = getOwner(request.yar)

      const postcode = owner.address?.postcode

      return h.view('register/owner/postcode', {
        postcode
      })
    }
  },
  {
    method: 'POST',
    path: '/register/owner/postcode',
    handler: (request, h) => {
      setOwnerPostcode(request.yar, request.payload)

      return h.redirect('/register/owner/select-address')
    }
  },
]
