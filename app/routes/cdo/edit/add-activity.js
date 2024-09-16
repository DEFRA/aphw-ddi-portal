const { routes, views } = require('../../../constants/cdo/dog')
const { keys } = require('../../../constants/cdo/activity.js')
const { anyLoggedInUser } = require('../../../auth/permissions.js')
const ViewModel = require('../../../models/cdo/edit/add-activity')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { validatePayload } = require('../../../schema/portal/edit/add-activity')
const { getMainReturnPoint, addBackNavigation } = require('../../../lib/back-helpers')
const { getActivityDetails, setActivityDetails } = require('../../../session/cdo/activity')
const { getPersonByReference } = require('../../../api/ddi-index-api/person.js')
const { getActivities } = require('../../../api/ddi-index-api/activities')
const { getUser } = require('../../../auth')

const getBackNav = (request) => ({
  backLink: getMainReturnPoint(request)
})

/**
 * @param pk
 * @param source
 * @param user
 * @return {Promise<*|{firstName: string, lastName: string, birthDate: string, personReference: string, address: Address, contacts: Contacts}>}
 */
const getSourceEntity = async (pk, source, user) => {
  return source === 'dog'
    ? await getCdo(pk, user)
    : await getPersonByReference(pk, user)
}

const getTitleReference = (source, entity) => {
  return source === 'dog'
    ? `Dog ${entity.dog.indexNumber}`
    : `${entity.firstName} ${entity.lastName}`
}

/**
 *
 * @param request
 * @param details
 * @param user
 * @param h
 * @return {Promise<*>}
 */
const handleForwardSkipIfNeeded = async (request, details, user, h) => {
  const numSentActivities = (await getActivities(keys.sent, details.source, user)).length
  const numReceivedActivities = (await getActivities(keys.received, details.source, user)).length

  if (numSentActivities > 0 && numReceivedActivities > 0) {
    const backNav = addBackNavigation(request)
    return h.view(views.addActivity, new ViewModel(details, backNav))
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
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const user = getUser(request)
        const entity = await getSourceEntity(request.params.pk, request.params.source, user)

        if (entity == null) {
          return h.response().code(404).takeover()
        }

        const activityDetails = getActivityDetails(request) || {}
        activityDetails.pk = request.params.pk
        activityDetails.source = request.params.source
        activityDetails.srcHashParam = request.query?.src
        activityDetails.titleReference = getTitleReference(activityDetails.source, entity)

        return await handleForwardSkipIfNeeded(request, activityDetails, user, h)
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.addActivity.post}/{pk}/{source}`,
    options: {
      auth: { scope: anyLoggedInUser },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          const user = getUser(request)
          const payload = request.payload

          const entity = await getSourceEntity(payload.pk, payload.source, user)

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

        const backNav = addBackNavigation(request)

        return h.redirect(`${routes.selectActivity.get}${backNav.srcHashParam}`)
      }
    }
  }
]
