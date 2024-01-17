const { routes, views } = require('../../../constants/cdo/dog')
const { admin } = require('../../../auth/permissions.js')
const getUser = require('../../../auth/get-user')
const ViewModel = require('../../../models/cdo/edit/change-status')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { updateStatus } = require('../../../api/ddi-index-api/dog')
const { validatePayload } = require('../../../schema/portal/edit/change-status')
const { addBackNavigation, addBackNavigationForErrorCondition, extractSrcParamFromUrl } = require('../../../lib/back-helpers')

module.exports = [
  {
    method: 'GET',
    path: `${routes.changeStatus.get}/{indexNumber}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const cdo = await getCdo(request.params.indexNumber)

        if (cdo == null) {
          return h.response().code(404).takeover()
        }

        const backNav = addBackNavigation(request)
        backNav.srcHashParam = extractSrcParamFromUrl(request?.headers?.referer, true)

        return h.view(views.changeStatus, new ViewModel(cdo.dog, backNav))
      }
    }
  },
  {
    method: 'POST',
    path: routes.changeStatus.post,
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

          const model = {
            status: cdo.dog.status,
            indexNumber: cdo.dog.indexNumber,
            newStatus: payload.newStatus
          }

          const viewModel = new ViewModel(model, backNav, error)

          return h.view(views.changeStatus, viewModel).code(400).takeover()
        }
      },
      handler: async (request, h) => {
        const payload = request.payload

        await updateStatus(payload, getUser(request))

        return h.redirect(`${routes.changeStatusConfirmation.get}/${payload.indexNumber}?src=${payload.srcHashParam}`)
      }
    }
  }
]
