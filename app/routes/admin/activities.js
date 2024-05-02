const { routes, views } = require('../../constants/admin')
const { admin } = require('../../auth/permissions')
const ViewModel = require('../../models/admin/activities')
const { getAllActivities } = require('../../api/ddi-index-api/activities')

module.exports = [
  {
    method: 'GET',
    path: `${routes.activities.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const activities = await getAllActivities()

        return h.view(views.activities, new ViewModel(activities))
      }
    }
  }
]
