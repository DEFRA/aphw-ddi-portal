const { getOwner } = require('../../../owner')
const { admin } = require('../../../auth/permissions')

module.exports = [
  {
    method: 'GET',
    path: '/register/owner/summary',
    options: {
      auth: { scope: [admin] },
      handler: (request, h) => {
        const owner = getOwner(request.yar)

        const firstName = owner.firstName
        const lastName = owner.lastName
        const isKeeper = owner.isKeeper ? 'Yes' : 'No'

        const address = []

        Object.keys(owner.address).forEach(key => {
          if (owner.address[key]) {
            address.push(owner.address[key])
          }
        })

        return h.view('register/owner/summary', {
          firstName,
          lastName,
          address,
          isKeeper
        })
      }
    }
  }
]
