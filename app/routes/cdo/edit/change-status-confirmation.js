const { routes, views } = require('../../../constants/cdo/dog')
const { anyLoggedInUser } = require('../../../auth/permissions.js')
const ViewModel = require('../../../models/cdo/edit/change-status-confirmation')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { getMainReturnPoint } = require('../../../lib/back-helpers')
const getUser = require('../../../auth/get-user')

module.exports = [
  {
    method: 'GET',
    path: `${routes.changeStatusConfirmation.get}/{indexNumber}`,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const cdo = await getCdo(request.params.indexNumber, getUser(request))

        if (cdo == null) {
          return h.response().code(404).takeover()
        }

        const backNav = { actionLink: getMainReturnPoint(request) }

        return h.view(views.changeStatusConfirmation, new ViewModel(cdo.dog, backNav))
      }
    }
  }]
