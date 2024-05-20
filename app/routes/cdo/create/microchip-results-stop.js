const { routes, views } = require('../../../constants/cdo/dog')
const ViewModel = require('../../../models/cdo/create/microchip-results-stop')
const { anyLoggedInUser } = require('../../../auth/permissions')
const { getMicrochipResults } = require('../../../session/cdo/dog')

module.exports = [{
  method: 'GET',
  path: `${routes.microchipResultsStop.get}/{dogId?}`,
  options: {
    auth: { scope: anyLoggedInUser },
    handler: async (request, h) => {
      const details = getMicrochipResults(request)
      details.dogId = request.params.dogId

      return h.view(views.microchipResultsStop, new ViewModel(details))
    }
  }
}]
