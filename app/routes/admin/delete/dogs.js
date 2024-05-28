const { routes, views } = require('../../../constants/admin')
const { admin } = require('../../../auth/permissions')
const ViewModel = require('../../../models/admin/delete/dogs')
const { getOldDogs } = require('../../../api/ddi-index-api/dogs')

module.exports = [
  {
    method: 'GET',
    path: `${routes.deleteDogs.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const dogs = await getOldDogs()

        return h.view(views.deleteDogs, new ViewModel(dogs))
      }
    }
  }
]
