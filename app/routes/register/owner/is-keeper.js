const { getOwner, setOwnerKeeper } = require('../../../owner')

module.exports = [
  {
    method: 'GET',
    path: '/register/owner/is-keeper',
    handler: (request, h) => {
      const owner = getOwner(request.yar)

      return h.view('register/owner/is-keeper', {
        isKeeper: owner.isKeeper ? 'yes' : 'no'
      })
    }
  },
  {
    method: 'POST',
    path: '/register/owner/is-keeper',
    handler: (request, h) => {
      setOwnerKeeper(request.yar, request.payload)

      return h.redirect('/register/owner/summary')
    }
  },
]
