const { routes, views } = require('../../../constants/cdo/owner')
const { routes: indexRoutes } = require('../../../constants/cdo/index')
const { getOwnerDetails, getEnforcementDetails, getAddress } = require('../../../session/cdo/owner')
const { getDogs } = require('../../../session/cdo/dog')
const ViewModel = require('../../../models/cdo/create/full-summary')
const { anyLoggedInUser } = require('../../../auth/permissions')
const { getCourts, getPoliceForces } = require('../../../api/ddi-index-api')
const getUser = require('../../../auth/get-user')
const { cdo } = require('../../../api/ddi-index-api')
const { buildCdoCreatePayload } = require('../../../lib/payload-builders')
const { setCreatedCdo } = require('../../../session/cdo')

module.exports = [{
  method: 'GET',
  path: routes.fullSummary.get,
  options: {
    auth: { scope: anyLoggedInUser },
    handler: async (request, h) => {
      const ownerDetails = getOwnerDetails(request)
      const address = getAddress(request)
      const dogs = getDogs(request)
      const enforcementDetails = getEnforcementDetails(request)
      const courts = await getCourts()
      const policeForces = await getPoliceForces()

      return h.view(views.fullSummary, new ViewModel(ownerDetails, address, enforcementDetails, courts, policeForces, dogs))
    }
  }
},
{
  method: 'POST',
  path: routes.fullSummary.post,
  options: {
    auth: { scope: anyLoggedInUser },
    handler: async (request, h) => {
      const owner = getOwnerDetails(request)
      const address = getAddress(request)
      const enforcementDetails = getEnforcementDetails(request)
      const dogs = getDogs(request)

      const cdoPayload = buildCdoCreatePayload(owner, address, enforcementDetails, dogs)

      const createdCdo = await cdo.createCdo(cdoPayload, getUser(request))

      request.yar.reset()

      setCreatedCdo(request, createdCdo)

      return h.redirect(indexRoutes.created.get)
    }
  }
}]
