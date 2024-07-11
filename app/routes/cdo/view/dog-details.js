const { routes, views } = require('../../../constants/cdo/dog')
const { routes: cdoRoutes } = require('../../../constants/cdo/index')
const statuses = require('../../../constants/cdo/status')
const { anyLoggedInUser } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/view/dog-details')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { addBackNavigation } = require('../../../lib/back-helpers')
const { setActivityDetails } = require('../../../session/cdo/activity')

module.exports = [
  {
    method: 'GET',
    path: `${routes.viewDogDetails.get}/{indexNumber?}`,
    options: {
      auth: { scope: anyLoggedInUser },
      handler: async (request, h) => {
        const indexNumber = request.params.indexNumber
        const cdo = await getCdo(indexNumber)

        if (cdo === undefined) {
          return h.response().code(404).takeover()
        }

        setActivityDetails(request, null)

        if (cdo.dog.status === statuses.PreExempt && request.query.force !== 'true') {
          return h.redirect(`${cdoRoutes.manageCdo.get}/${indexNumber}?src=${request.query.src}`)
        }

        const backNav = addBackNavigation(request, true)

        return h.view(views.viewDogDetails, new ViewModel(cdo, backNav))
      }
    }
  }
]
