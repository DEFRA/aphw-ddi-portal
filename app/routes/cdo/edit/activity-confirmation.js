const { routes, views } = require('../../../constants/cdo/dog')
const { admin } = require('../../../auth/permissions.js')
const ViewModel = require('../../../models/cdo/edit/activity-confirmation')
const { getActivityDetails, setActivityDetails } = require('../../../session/cdo/activity')
const { getActivityById } = require('../../../api/ddi-index-api/activities')
const { formatToGds } = require('../../../lib/date-helpers')
const { getMainReturnPoint } = require('../../../lib/back-helpers')

const getSourceDescription = details => {
  return details.source === 'dog' ? `Dog ${details.pk}` : details.name
}

const getAlternativeReturnLink = details => {
  return details.source === 'dog' ? `${routes.viewDogDetails.get}/${details.indexNumber}` : 'NOT YET DEFINED'
}

module.exports = [
  {
    method: 'GET',
    path: `${routes.activityConfirmation.get}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const details = getActivityDetails(request)

        if (!details?.activity || !details?.pk || !details?.source || !details?.activityDate) {
          return h.response().code(404).takeover()
        }

        const activity = await getActivityById(details.activity)

        const model = {
          message: `${activity.label} ${details.activityType} on ${formatToGds(details.activityDate)}`,
          returnLink: getMainReturnPoint(request) !== '/' ? getMainReturnPoint(request) : getAlternativeReturnLink(details),
          sourceDescription: getSourceDescription(details),
          source: details.source
        }

        setActivityDetails(request, null)

        return h.view(views.activityConfirmation, new ViewModel(model))
      }
    }
  }
]
