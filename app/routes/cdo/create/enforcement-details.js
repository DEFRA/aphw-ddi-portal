const { routes, views } = require('../../../constants/cdo/owner')
const { getEnforcementDetails, setEnforcementDetails } = require('../../../session/cdo/owner')
const ViewModel = require('../../../models/cdo/create/enforcement-details')
const enforcementDetailsSchema = require('../../../schema/portal/owner/enforcement-details')
const { anyLoggedInUser } = require('../../../auth/permissions')
const { getCourts, getPoliceForces } = require('../../../api/ddi-index-api')

module.exports = [{
  method: 'GET',
  path: routes.enforcementDetails.get,
  options: {
    auth: { scope: anyLoggedInUser },
    handler: async (request, h) => {
      const enforcementDetails = getEnforcementDetails(request)
      const courts = await getCourts()
      const policeForces = await getPoliceForces()
      return h.view(views.enforcementDetails, new ViewModel(enforcementDetails, courts, policeForces))
    }
  }
},
{
  method: 'POST',
  path: routes.enforcementDetails.post,
  options: {
    auth: { scope: anyLoggedInUser },
    validate: {
      payload: enforcementDetailsSchema,
      failAction: async (request, h, error) => {
        const enforcementDetails = { ...getEnforcementDetails(request), ...request.payload }
        const courts = await getCourts()
        const policeForces = await getPoliceForces()
        return h.view(views.enforcementDetails, new ViewModel(enforcementDetails, courts, policeForces, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const enforcementDetails = request.payload

      setEnforcementDetails(request, enforcementDetails)

      return h.redirect(routes.fullSummary.get)
    }
  }
}]
