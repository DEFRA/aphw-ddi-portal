const { routes, views } = require('../../../constants/cdo/dog')
const { keys } = require('../../../constants/cdo/activity.js')
const { admin } = require('../../../auth/permissions.js')
const ViewModel = require('../../../models/cdo/edit/add-activity')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { validatePayload } = require('../../../schema/portal/edit/add-activity')
const { getMainReturnPoint } = require('../../../lib/back-helpers')
const { getActivityDetails, setActivityDetails } = require('../../../session/cdo/activity')
const { getPersonByReference } = require('../../../api/ddi-index-api/person.js')
const { getActivities } = require('../../../api/ddi-index-api/activities')

const getBackNav = (request) => ({
  backLink: getMainReturnPoint(request)
})

const getSourceEntity = async (pk, source) => {
  return source === 'dog'
    ? await getCdo(pk)
    : await getPersonByReference(pk)
}

const getTitleReference = (source, entity) => {
  return source === 'dog'
    ? `Dog ${entity.dog.indexNumber}`
    : `${entity.firstName} ${entity.lastName}`
}

const handleForwardSkipIfNeeded = async (request, details, h) => {
  const numSentActivities = (await getActivities(keys.sent, details.source)).length
  const numReceivedActivities = (await getActivities(keys.received, details.source)).length

  if (numSentActivities > 0 && numReceivedActivities > 0) {
    return h.view(views.addActivity, new ViewModel(details, getBackNav(request)))
  } else {
    details.activityType = numSentActivities > 0 ? keys.sent : keys.received
    details.skippedFirstPage = 'true'
    setActivityDetails(request, details)
    return h.redirect(`${routes.selectActivity.get}`)
  }
}

module.exports = [
  {
    method: 'GET',
    path: `${routes.addActivity.get}/{pk}/{source}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const entity = await getSourceEntity(request.params.pk, request.params.source)

        if (entity == null) {
          return h.response().code(404).takeover()
        }

        const activityDetails = getActivityDetails(request) || {}
        activityDetails.pk = request.params.pk
        activityDetails.source = request.params.source
        activityDetails.srcHashParam = request.query?.src
        activityDetails.titleReference = getTitleReference(activityDetails.source, entity)

        return await handleForwardSkipIfNeeded(request, activityDetails, h)
      }
    }
  },
  {
    method: 'POST',
    path: routes.addActivity.post,
    options: {
      auth: { scope: [admin] },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          const payload = request.payload

          const entity = await getSourceEntity(payload.pk, payload.source)

          if (entity == null) {
            return h.response().code(404).takeover()
          }

          const model = { ...getActivityDetails(request), ...request.payload }

          const viewModel = new ViewModel(model, getBackNav(request), error)

          return h.view(views.addActivity, viewModel).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const payload = request.payload

        setActivityDetails(request, payload)

        return h.redirect(`${routes.selectActivity.get}`)
      }
    }
  }
]
