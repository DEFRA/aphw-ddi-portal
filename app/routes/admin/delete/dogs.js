const { routes, views } = require('../../../constants/admin')
const { admin } = require('../../../auth/permissions')
const { ViewModel } = require('../../../models/admin/delete/dogs')
const { getOldDogs } = require('../../../api/ddi-index-api/dogs')
const { addBackNavigation } = require('../../../lib/back-helpers')

module.exports = [
  {
    method: 'GET',
    path: `${routes.deleteDogs1.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const sort = { column: 'status', order: 'ASC' }

        const dogs = await getOldDogs(sort)

        const backNav = addBackNavigation(request)

        return h.view(views.deleteDogs, new ViewModel(dogs, sort, backNav))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.deleteDogs1.post}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const payload = request.payload
        console.log('payload', payload)
        return h.redirect(routes.deleteDogs1.get)
      }
    }
  }
]
