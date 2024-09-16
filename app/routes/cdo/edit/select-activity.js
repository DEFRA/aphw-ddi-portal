const { routes, views } = require('../../../constants/cdo/dog')
const { routes: ownerRoutes } = require('../../../constants/cdo/owner')
const { anyLoggedInUser } = require('../../../auth/permissions.js')
const ViewModel = require('../../../models/cdo/edit/select-activity')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { validatePayload } = require('../../../schema/portal/edit/select-activity')
const { getActivities } = require('../../../api/ddi-index-api/activities')
const { addDateComponents } = require('../../../lib/date-helpers')
const { setActivityDetails, getActivityDetails } = require('../../../session/cdo/activity')
const { recordActivity } = require('../../../api/ddi-index-api/activities')
const getUser = require('../../../auth/get-user')
const { deepClone } = require('../../../lib/model-helpers.js')
const { getPersonByReference } = require('../../../api/ddi-index-api/person.js')
const { addBackNavigation, addBackNavigationForErrorCondition, getMainReturnPoint } = require('../../../lib/back-helpers')

/**
 * @param details
 * @param user
 * @return {Promise<*|{firstName: string, lastName: string, birthDate: string, personReference: string, address: Address, contacts: Contacts}>}
 */
const getSourceEntity = async (details, user) => {
  return details.source === 'dog'
    ? await getCdo(details.pk, user)
    : await getPersonByReference(details.pk, user)
}

const getEditLink = details => {
  return details.source === 'dog'
    ? `${routes.editDogDetails.get}/${details.pk}?src=${details.srcHashParam}`
    : `${ownerRoutes.viewOwnerDetails.get}/${details.pk}?src=${details.srcHashParam}`
}

module.exports = [
  {
    method: 'GET',
    path: `${routes.selectActivity.get}`,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const user = getUser(request)
        const activityDetails = getActivityDetails(request)

        const entity = await getSourceEntity(activityDetails, user)

        if (entity == null || !activityDetails?.activityType) {
          return h.response().code(404).takeover()
        }

        const activityList = await getActivities(activityDetails.activityType, activityDetails.source, user, true)

        const backNav = addBackNavigation(request)

        if (backNav.backLink === '/') {
          backNav.backLink = getMainReturnPoint(request)
        }

        const model = {
          activityType: activityDetails?.activityType,
          activityList,
          pk: activityDetails.pk,
          source: activityDetails.source,
          activityDate: new Date(),
          editLink: getEditLink(activityDetails),
          titleReference: activityDetails.titleReference,
          skippedFirstPage: activityDetails.skippedFirstPage
        }

        addDateComponents(model, 'activityDate')

        return h.view(views.selectActivity, new ViewModel(model, backNav))
      }
    }
  },
  {
    method: 'POST',
    path: routes.selectActivity.post,
    options: {
      auth: { scope: anyLoggedInUser },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          const user = getUser(request)
          const payload = request.payload

          const activityType = payload.activityType

          const entity = await getSourceEntity(payload, user)
          if (entity == null || !activityType) {
            return h.response().code(404).takeover()
          }

          const activityList = await getActivities(activityType, payload.source, user, true)

          const model = { ...getActivityDetails(request), ...request.payload, activityList }
          model.editLink = getEditLink(model)

          const backNav = addBackNavigationForErrorCondition(request)

          if (backNav.backLink === '/') {
            backNav.backLink = getMainReturnPoint(request)
          }

          const viewModel = new ViewModel(model, backNav, error)

          return h.view(views.selectActivity, viewModel).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const payload = request.payload

        setActivityDetails(request, payload)

        const activityPayload = deepClone(payload)

        const activityModel = {
          activity: activityPayload.activity,
          activityType: activityPayload.activityType,
          pk: activityPayload.pk,
          source: activityPayload.source,
          activityDate: activityPayload.activityDate
        }

        // send event to API for forwarding to service bus (since may need to perform an atomic DB operation as part of process)
        await recordActivity(activityModel, getUser(request))

        return h.redirect(routes.activityConfirmation.get)
      }
    }
  }
]
