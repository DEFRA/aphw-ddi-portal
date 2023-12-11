const { routes, views } = require('../../../constants/cdo')
const { admin } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/create/record-created')
const { getCreatedCdo } = require('../../../session/cdo')

module.exports = [
  {
    method: 'GET',
    path: routes.created.get,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const cdo = getCreatedCdo(request)

        return h.view(views.created, new ViewModel(cdo))
      }
    }
  }
]
