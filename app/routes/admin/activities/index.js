const { routes, views } = require('../../../constants/admin')
const { admin } = require('../../../auth/permissions')
const { ActivityListViewModel } = require('../../../models/admin/activities/builder')
const { getAllActivities } = require('../../../api/ddi-index-api/activities')
const { getUser } = require('../../../auth')

module.exports = [
  {
    method: 'GET',
    path: `${routes.activities.index.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const user = getUser(request)
        const activities = await getAllActivities(user)

        return h.view(views.activities, ActivityListViewModel(activities))
      }
    }
  }
]
