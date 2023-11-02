const { getOwner, setOwnerKeeper } = require('../../../owner')
const { admin } = require('../../../auth/permissions')

module.exports = [
  {
    method: 'GET',
    path: '/register/owner/is-keeper',
    options: {
      auth: { scope: [admin] },
      handler: (request, h) => {
        const owner = getOwner(request.yar)

        return h.view('register/owner/is-keeper', {
          isKeeper: owner.isKeeper ? 'yes' : 'no'
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/register/owner/is-keeper',
    options: {
      auth: { scope: [admin] },
      handler: (request, h) => {
        setOwnerKeeper(request.yar, request.payload)

        return h.redirect('/register/owner/summary')
      }
    }
  }
]
