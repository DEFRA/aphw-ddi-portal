const { routes, views } = require('../../../constants/owner')
const { getEnforcementDetails, setEnforcementDetails } = require('../../../session/cdo/owner')
const ViewModel = require('../../../models/cdo/create/enforcement-details')
const enforcementDetailsSchema = require('../../../schema/portal/owner/enforcement-details')
const { admin } = require('../../../auth/permissions')
const { getCourts, getPoliceForces } = require('../../../api/ddi-index-api')

module.exports = [{
  method: 'GET',
  path: routes.enforcementDetails.get,
  options: {
    auth: { scope: [admin] },
    handler: async (request, h) => {
      console.log('here1')
      const enforcementDetails = getEnforcementDetails(request)
      const courts = await getCourts()
      console.log('here3', courts)
      const policeForces = await getPoliceForces()
      console.log('here4', policeForces)
      return h.view(views.enforcementDetails, new ViewModel(enforcementDetails, courts, policeForces))
    }
  }
},
{
  method: 'POST',
  path: routes.enforcementDetails.post,
  options: {
    auth: { scope: [admin] },
    validate: {
      payload: enforcementDetailsSchema,
      failAction: async (request, h, error) => {
        const enforcementDetails = { ...getEnforcementDetails(request), ...request.payload }
        const courts = [{ name: 'Choose court' }].concat(await getCourts())
        const policeForces = await getPoliceForces()
        return h.view(views.enforcementDetails, new ViewModel(enforcementDetails, courts, policeForces, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const enforcementDetails = request.payload

      setEnforcementDetails(request, enforcementDetails)

      return h.redirect(routes.home.get)
    }
  }
}]
