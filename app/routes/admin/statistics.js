const { routes, views } = require('../../constants/admin')
const { admin } = require('../../auth/permissions')
const statisticsQueries = require('../../constants/statistics')
const ViewModel = require('../../models/admin/statistics')
const { getStatistics } = require('../../api/ddi-index-api/statistics')
const { getUser } = require('../../auth')

module.exports = [
  {
    method: 'GET',
    path: `${routes.statistics.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const user = getUser(request)
        const statsByStatus = await getStatistics(statisticsQueries.countsPerStatus, user)

        const statsByCountry = await getStatistics(statisticsQueries.countsPerCountry, user)

        return h.view(views.statistics, new ViewModel(statsByStatus, statsByCountry))
      }
    }
  }
]
