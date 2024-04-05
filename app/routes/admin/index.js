const { routes, views } = require('../../constants/admin')
const { admin } = require('../../auth/permissions')

module.exports = [
  {
    method: 'GET',
    path: `${routes.index.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        return h.view(views.index)
      }
    }
  }
]
