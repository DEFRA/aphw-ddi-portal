const { routes, views } = require('../../../constants/cdo/index')
const { anyLoggedInUser } = require('../../../auth/permissions')
const { addBackNavigation } = require('../../../lib/back-helpers')
const ViewModel = require('../../../models/cdo/manage/live')
const { getLiveCdos, getLiveCdosWithinMonth } = require('../../../api/ddi-index-api/cdos')

module.exports = [
  {
    method: 'GET',
    path: `${routes.manage.get}/{tab?}`,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const backNav = addBackNavigation(request)
        const tab = request.params.tab ?? 'live'

        const sort = {
          column: 'cdoExpiry',
          order: 'ASC'
        }

        let dogRecords

        if (tab === 'due') {
          dogRecords = await getLiveCdosWithinMonth(sort)
        } else {
          dogRecords = await getLiveCdos(sort)
        }

        return h.view(views.manage, new ViewModel(dogRecords, tab, sort, backNav))
      }
    }
  }
]
