const { routes, views } = require('../../../constants/cdo/owner')
const { routes: dogRoutes } = require('../../../constants/cdo/dog')
const { getEnforcementDetails, setEnforcementDetails } = require('../../../session/cdo/owner')
const ViewModel = require('../../../models/cdo/create/enforcement-details')
const enforcementDetailsSchema = require('../../../schema/portal/owner/enforcement-details')
const { anyLoggedInUser } = require('../../../auth/permissions')
const { getCourts, getPoliceForces } = require('../../../api/ddi-index-api')
const { getDogs } = require('../../../session/cdo/dog')

const backNavStandard = { backLink: dogRoutes.confirm.get }
const backNavSummary = { backLink: routes.fullSummary.get }
const getBackNav = request => {
  return request?.query?.fromSummary === 'true' ? backNavSummary : backNavStandard
}

/**
 * @param {DogSession[]} dogs
 * @return {boolean}
 */
const courtIsMandatory = (dogs) => {
  return dogs.some(dog => dog.applicationType === 'cdo')
}

module.exports = [{
  method: 'GET',
  path: routes.enforcementDetails.get,
  options: {
    auth: { scope: anyLoggedInUser },
    handler: async (request, h) => {
      const enforcementDetails = getEnforcementDetails(request)
      const courts = await getCourts()
      const policeForces = await getPoliceForces()
      const dogs = getDogs(request)

      return h.view(views.enforcementDetails, new ViewModel(enforcementDetails, courts, courtIsMandatory(dogs), policeForces, getBackNav(request)))
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
        const dogs = getDogs(request)

        return h.view(views.enforcementDetails, new ViewModel(enforcementDetails, courts, courtIsMandatory(dogs), policeForces, getBackNav(request), error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const enforcementDetails = request.payload

      setEnforcementDetails(request, enforcementDetails)

      return h.redirect(routes.fullSummary.get)
    }
  }
}]
