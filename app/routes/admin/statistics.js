const { routes, views } = require('../../constants/admin')
const { admin } = require('../../auth/permissions')
const statisticsQueries = require('../../constants/statistics')
const ViewModel = require('../../models/admin/statistics')
const { getStatistics } = require('../../api/ddi-index-api/statistics')

module.exports = [
  {
    method: 'GET',
    path: `${routes.statistics.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const statsByStatus = await getStatistics(statisticsQueries.countsPerStatus)

        const statsByCountry = await getStatistics(statisticsQueries.countsPerCountry)

        return h.view(views.statistics, new ViewModel(statsByStatus, statsByCountry))
      }
    }
  }
]
