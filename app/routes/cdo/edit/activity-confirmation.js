const { routes, views } = require('../../../constants/cdo/dog')
const { anyLoggedInUser } = require('../../../auth/permissions.js')
const ViewModel = require('../../../models/cdo/edit/activity-confirmation')
const { getActivityDetails, setActivityDetails } = require('../../../session/cdo/activity')
const { getActivityById } = require('../../../api/ddi-index-api/activities')
const { formatToGds } = require('../../../lib/date-helpers')
const { getMainReturnPoint } = require('../../../lib/back-helpers')
const { getUser } = require('../../../auth')

const getAlternativeReturnLink = details => {
  return details.source === 'dog' ? `${routes.viewDogDetails.get}/${details.indexNumber}` : 'NOT YET DEFINED'
}

const getActivityLink = details => {
  return details.source === 'dog' ? `${routes.viewActivities.get}/${details.pk}/dog` : 'NOT YET DEFINED'
}

module.exports = [
  {
    method: 'GET',
    path: `${routes.activityConfirmation.get}`,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const details = getActivityDetails(request)

        if (!details?.activity || !details?.pk || !details?.source || !details?.activityDate) {
          return h.response().code(404).takeover()
        }

        const user = getUser(request)
        const activity = await getActivityById(details.activity, user)

        const model = {
          message: `${activity.label} ${details.activityType} on ${formatToGds(details.activityDate)}`,
          returnLink: getMainReturnPoint(request) !== '/' ? getMainReturnPoint(request) : getAlternativeReturnLink(details),
          sourceDescription: details.titleReference,
          source: details.source,
          activityLink: getActivityLink(details)
        }

        setActivityDetails(request, null)

        return h.view(views.activityConfirmation, new ViewModel(model))
      }
    }
  }
]
