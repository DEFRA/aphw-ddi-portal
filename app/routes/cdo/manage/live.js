const { routes, views } = require('../../../constants/cdo/index')
const { anyLoggedInUser } = require('../../../auth/permissions')
const { addBackNavigation } = require('../../../lib/back-helpers')
const ViewModel = require('../../../models/cdo/manage/live')
const { getLiveCdos, getLiveCdosWithinMonth, getInterimExemptions, getExpiredCdos } = require('../../../api/ddi-index-api/cdos')
const { manageCdosGetschema } = require('../../../schema/portal/cdo/manage')

module.exports = [
  {
    method: 'GET',
    path: `${routes.manage.get}/{tab?}`,
    options: {
      auth: { scope: anyLoggedInUser },
      validate: {
        params: manageCdosGetschema,
        failAction: async (_, h) => {
          return h.response().code(404).takeover()
        }
      },
      handler: async (request, h) => {
        const backNav = addBackNavigation(request)
        const tab = request.params.tab
        const column = tab === 'interim' ? 'joinedExemptionScheme' : 'cdoExpiry'

        const sort = {
          column,
          order: 'ASC'
        }

        let dogRecords

        if (tab === 'due') {
          dogRecords = await getLiveCdosWithinMonth(sort)
        } else if (tab === 'interim') {
          dogRecords = await getInterimExemptions(sort)
        } else if (tab === 'expired') {
          dogRecords = await getExpiredCdos(sort)
        } else {
          dogRecords = await getLiveCdos(sort)
        }

        return h.view(views.manage, new ViewModel(dogRecords, tab, sort, backNav))
      }
    }
  }
]
