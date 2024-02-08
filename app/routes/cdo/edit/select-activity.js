const { routes, views } = require('../../../constants/cdo/dog')
const { admin } = require('../../../auth/permissions.js')
const ViewModel = require('../../../models/cdo/edit/select-activity')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { validatePayload } = require('../../../schema/portal/edit/select-activity')
const { addBackNavigation, addBackNavigationForErrorCondition } = require('../../../lib/back-helpers')
const { getActivities } = require('../../../api/ddi-index-api/activities')
const { addDateComponents } = require('../../../lib/date-helpers')
const { setActivityDetails } = require('../../../session/cdo/activity')

module.exports = [
  {
    method: 'GET',
    path: `${routes.selectActivity.get}/{indexNumber}/{activityType}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const activityType = request.params.activityType

        const cdo = await getCdo(request.params.indexNumber)

        if (cdo == null || !activityType) {
          return h.response().code(404).takeover()
        }

        const backNav = addBackNavigation(request)

        const activityList = await getActivities(activityType)

        const model = {
          activityType,
          activityList,
          indexNumber: cdo.dog.indexNumber,
          activityDate: new Date()
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
      auth: { scope: [admin] },
      validate: {
        payload: validatePayload,
        failAction: async (request, h, error) => {
          const payload = request.payload

          const activityType = payload.activityType

          const cdo = await getCdo(payload.indexNumber)
          if (cdo == null || !activityType) {
            return h.response().code(404).takeover()
          }

          const backNav = addBackNavigationForErrorCondition(request)

          const activityList = await getActivities(activityType)

          const model = {
            ...payload,
            activityList
          }

          const viewModel = new ViewModel(model, backNav, error)

          return h.view(views.selectActivity, viewModel).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const payload = request.payload

        setActivityDetails(request, payload)

        // send event

        return h.redirect(routes.activityConfirmation.get)
      }
    }
  }
]
