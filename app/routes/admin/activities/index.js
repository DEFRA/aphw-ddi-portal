const { routes, views } = require('../../../constants/admin')
const { admin } = require('../../../auth/permissions')
const { ActivityListViewModel } = require('../../../models/admin/activities/builder')
const { getAllActivities } = require('../../../api/ddi-index-api/activities')

module.exports = [
  {
    method: 'GET',
    path: `${routes.activities.index.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const activities = await getAllActivities()

        return h.view(views.activities, ActivityListViewModel(activities))
      }
    }
  }
]
