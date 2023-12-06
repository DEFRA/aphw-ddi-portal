const { routes, views } = require('../../../constants/owner')
const { routes: dogRoutes } = require('../../../constants/cdo/dog')
const { getOwnerDetails, getEnforcementDetails, getAddress } = require('../../../session/cdo/owner')
const ViewModel = require('../../../models/cdo/create/owner-summary')
const { admin } = require('../../../auth/permissions')
const { getCourts, getPoliceForces } = require('../../../api/ddi-index-api')

module.exports = [{
  method: 'GET',
  path: routes.ownerSummary.get,
  options: {
    auth: { scope: [admin] },
    handler: async (request, h) => {
      const ownerDetails = getOwnerDetails(request)
      const address = getAddress(request)
      const enforcementDetails = getEnforcementDetails(request)
      const courts = await getCourts()
      const policeForces = await getPoliceForces()

      return h.view(views.ownerSummary, new ViewModel(ownerDetails, address, enforcementDetails, courts, policeForces))
    }
  }
},
{
  method: 'POST',
  path: routes.ownerSummary.post,
  options: {
    auth: { scope: [admin] },
    handler: async (request, h) => {
      return h.redirect(dogRoutes.details.get)
    }
  }
}]
