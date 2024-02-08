const { routes, views } = require('../../../constants/cdo/dog')
const { admin } = require('../../../auth/permissions.js')
const ViewModel = require('../../../models/cdo/edit/activity-confirmation')
const { getActivityDetails } = require('../../../session/cdo/activity')
const { getActivityById } = require('../../../api/ddi-index-api/activities')
const { formatToGds } = require('../../../lib/date-helpers')

module.exports = [
  {
    method: 'GET',
    path: `${routes.activityConfirmation.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const details = getActivityDetails(request)

        if (!details?.activity || !details?.indexNumber || !details?.activityDate) {
          return h.response().code(404).takeover()
        }

        const activity = await getActivityById(details.activity)

        const model = {
          indexNumber: details.indexNumber,
          message: `${activity.text} ${details.activityType} on ${formatToGds(details.activityDate)}`
        }

        return h.view(views.activityConfirmation, new ViewModel(model))
      }
    }
  }
]
