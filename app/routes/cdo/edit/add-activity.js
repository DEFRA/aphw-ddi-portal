const { routes, views } = require('../../../constants/cdo/dog')
const { admin } = require('../../../auth/permissions.js')
const ViewModel = require('../../../models/cdo/edit/add-activity')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { validatePayload } = require('../../../schema/portal/edit/add-activity')
const { addBackNavigation, addBackNavigationForErrorCondition } = require('../../../lib/back-helpers')

module.exports = [
  {
    method: 'GET',
    path: `${routes.addActivity.get}/{indexNumber}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const cdo = await getCdo(request.params.indexNumber)

        if (cdo == null) {
          return h.response().code(404).takeover()
        }

        const backNav = addBackNavigation(request)

        return h.view(views.addActivity, new ViewModel(cdo.dog, backNav))
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

          const cdo = await getCdo(payload.indexNumber)
          if (cdo == null) {
            return h.response().code(404).takeover()
          }

          const backNav = addBackNavigationForErrorCondition(request)

          const model = { indexNumber: payload.indexNumber }

          const viewModel = new ViewModel(model, backNav, error)

          return h.view(views.addActivity, viewModel).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const payload = request.payload

        return h.redirect(`${routes.selectActivity.get}/${payload.indexNumber}/${payload.activityType}${payload.srcHashParam}`)
      }
    }
  }
]
