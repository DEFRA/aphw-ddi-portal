const { getOwner, setOwnerName } = require('../../../owner')

module.exports = [
  {
    method: 'GET',
    path: '/register/owner/name',
    handler: (request, h) => {
      const owner = getOwner(request.yar)

      return h.view('register/owner/name', {
        firstName: owner.firstName,
        lastName: owner.lastName
      })
    }
  },
  {
    method: 'POST',
    path: '/register/owner/name',
    handler: (request, h) => {
      setOwnerName(request.yar, request.payload)

      return h.redirect('/register/owner/postcode')
    }
  },
]
