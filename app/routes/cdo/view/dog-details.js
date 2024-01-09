const { routes, views } = require('../../../constants/cdo/dog')
const { admin } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/view/dog-details')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { addBackNavigation } = require('../../../lib/back-helpers')

module.exports = [
  {
    method: 'GET',
    path: `${routes.viewDogDetails.get}/{indexNumber?}`,
    options: {
      auth: { scope: [admin] },
      handler: async (request, h) => {
        const cdo = await getCdo(request.params.indexNumber)

        if (cdo === undefined) {
          return h.response().code(404).takeover()
        }

        const backNav = addBackNavigation(request)

        return h.view(views.viewDogDetails, new ViewModel(cdo, backNav))
      }
    }
  }
]
