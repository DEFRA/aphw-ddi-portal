const { routes, views } = require('../../../constants/cdo/dog')
const { admin } = require('../../../auth/permissions.js')
const ViewModel = require('../../../models/cdo/edit/change-status-confirmation')
const { getCdo } = require('../../../api/ddi-index-api/cdo')

module.exports = [
  {
    method: 'GET',
    path: `${routes.changeStatusConfirmation.get}/{indexNumber}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const cdo = await getCdo(request.params.indexNumber)

        if (cdo == null) {
          return h.response().code(404).takeover()
        }

        const backNav = {
          srcHashParam: request?.query?.src ? `?src=${request?.query?.src}` : ''
        }

        return h.view(views.changeStatusConfirmation, new ViewModel(cdo.dog, backNav))
      }
    }
  }]
