const { routes, views } = require('../../../constants/cdo/dog')
const { anyLoggedInUser } = require('../../../auth/permissions.js')
const ViewModel = require('../../../models/cdo/edit/send-certificate-confirmation')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { getMainReturnPoint } = require('../../../lib/back-helpers')
const getUser = require('../../../auth/get-user')

module.exports = [
  {
    method: 'GET',
    path: `${routes.sendCertificateConfirmation.get}/{indexNumber}/{sendOption}`,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const cdo = await getCdo(request.params.indexNumber, getUser(request))

        if (cdo == null) {
          return h.response().code(404).takeover()
        }

        const backNav = { actionLink: getMainReturnPoint(request) }

        const details = {
          cdo,
          sendOption: request.params.sendOption
        }

        return h.view(views.sendCertificateConfirmation, new ViewModel(details, backNav))
      }
    }
  }
]
