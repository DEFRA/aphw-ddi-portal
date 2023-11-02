const { getOwner, setOwnerName } = require('../../../owner')
const { admin } = require('../../../auth/permissions')

module.exports = [
  {
    method: 'GET',
    path: '/register/owner/name',
    options: {
      auth: { scope: [admin] },
      handler: (request, h) => {
        const owner = getOwner(request.yar)

        return h.view('register/owner/name', {
          firstName: owner.firstName,
          lastName: owner.lastName
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/register/owner/name',
    options: {
      auth: { scope: [admin] },
      handler: (request, h) => {
        setOwnerName(request.yar, request.payload)

        return h.redirect('/register/owner/address')
      }
    }
  }
]
