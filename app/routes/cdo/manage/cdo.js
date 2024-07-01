const { routes, views } = require('../../../constants/cdo/index')
const { anyLoggedInUser } = require('../../../auth/permissions')
const { addBackNavigation } = require('../../../lib/back-helpers')
const { getManageCdoDetails } = require('../../../api/ddi-index-api/cdo')
const ViewModel = require('../../../models/cdo/manage/cdo')
const { getCdo } = require('../../../api/ddi-index-api/cdo')

module.exports = [
  {
    method: 'GET',
    path: `${routes.manageCdo.get}/{dogIndex?}`,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const backNav = addBackNavigation(request)

        const dogIndex = request.params.dogIndex
        const details = await getManageCdoDetails(dogIndex)

        if (details == null) {
          return h.response().code(404).takeover()
        }

        const cdo = await getCdo(dogIndex)
        return h.view(views.manageCdo, new ViewModel(details, cdo, backNav))
      }
    }
  }
]
