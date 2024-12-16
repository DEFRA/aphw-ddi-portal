const { routes, views } = require('../../../constants/cdo/index')
const { anyLoggedInUser } = require('../../../auth/permissions')
const { addBackNavigation } = require('../../../lib/back-helpers')
const ViewModel = require('../../../models/cdo/manage/live')
const { getLiveCdos, getLiveCdosWithinMonth, getInterimExemptions, getExpiredCdos } = require('../../../api/ddi-index-api/cdos')
const { manageCdosGetschema, manageCdosQueryschema } = require('../../../schema/portal/cdo/manage')
const { getUser } = require('../../../auth')

module.exports = [
  {
    method: 'GET',
    path: `${routes.manage.get}/{tab?}`,
    options: {
      auth: { scope: anyLoggedInUser },
      validate: {
        params: manageCdosGetschema,
        query: manageCdosQueryschema,
        failAction: async (_, h) => {
          return h.response().code(404).takeover()
        }
      },
      handler: async (request, h) => {
        const backNav = addBackNavigation(request)
        const user = getUser(request)

        const tab = request.params.tab
        let defaultOrder

        const defaultColumn = tab === 'interim' ? 'interimExemptFor' : 'cdoExpiry'

        if (request.query.sortKey === undefined && tab === 'interim') {
          defaultOrder = 'DESC'
        } else {
          defaultOrder = 'ASC'
        }

        const order = request.query.sortOrder ?? defaultOrder
        const column = request.query.sortKey ?? defaultColumn

        const sort = {
          column,
          order
        }

        let cdos, counts

        if (tab === 'due') {
          ({ cdos, counts } = await getLiveCdosWithinMonth(user, sort))
        } else if (tab === 'interim') {
          ({ cdos, counts } = await getInterimExemptions(user, sort))
        } else if (tab === 'expired') {
          ({ cdos, counts } = await getExpiredCdos(user, sort))
        } else {
          ({ cdos, counts } = await getLiveCdos(user, sort))
        }

        return h.view(views.manage, new ViewModel(cdos, counts, tab, sort, backNav))
      }
    }
  }
]
