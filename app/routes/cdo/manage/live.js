const { routes, views } = require('../../../constants/cdo/index')
const { anyLoggedInUser } = require('../../../auth/permissions')
const { addBackNavigation } = require('../../../lib/back-helpers')
const ViewModel = require('../../../models/cdo/manage/live')
const { getLiveCdos } = require('../../../api/ddi-index-api/cdos')
module.exports = [
  {
    method: 'GET',
    path: routes.manage.get,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const backNav = addBackNavigation(request)

        const sort = {
          column: 'cdoExpiry',
          order: 'ASC'
        }
        const dogRecords = await getLiveCdos(sort)

        return h.view(views.manage, new ViewModel(dogRecords, 'live', sort, backNav))
      }
    }
  }
]
