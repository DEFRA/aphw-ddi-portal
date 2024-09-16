const { routes, views } = require('../../constants/admin')
const { admin } = require('../../auth/permissions')
const ViewModel = require('../../models/admin/regular-jobs')
const { getRegularJobs } = require('../../api/ddi-index-api/regular-jobs')
const { getUser } = require('../../auth')

module.exports = [
  {
    method: 'GET',
    path: `${routes.regularJobs.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const user = getUser(request)
        const allJobs = await getRegularJobs(user)

        return h.view(views.regularJobs, new ViewModel(allJobs))
      }
    }
  }
]
