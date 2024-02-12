const { routes, views } = require('../../../constants/cdo/dog')
const { admin } = require('../../../auth/permissions.js')
const ViewModel = require('../../../models/cdo/edit/add-activity')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { validatePayload } = require('../../../schema/portal/edit/add-activity')
const { getMainReturnPoint } = require('../../../lib/back-helpers')
const { getActivityDetails, setActivityDetails } = require('../../../session/cdo/activity')

const getBackNav = (request) => ({
  backLink: getMainReturnPoint(request)
})

const getSourceEntity = async (pk, source) => {
  return source === 'dog'
    ? await getCdo(pk)
    : null
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

        return h.view(views.addActivity, new ViewModel(activityDetails, getBackNav(request)))
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
