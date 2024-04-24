const { routes, views } = require('../../../constants/cdo/index')
const { anyLoggedInUser } = require('../../../auth/permissions')
const { addBackNavigation } = require('../../../lib/back-helpers')
const ViewModel = require('../../../models/cdo/manage/live')
module.exports = [
  {
    method: 'GET',
    path: routes.manage.get,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const backNav = addBackNavigation(request)

        const dogRecords = []
        const sort = {
          column: 'cdoExpiry',
          order: 'ASC'
        }
        return h.view(views.manage, new ViewModel(dogRecords, 'live', sort, backNav))
      }
    }
  }
]
