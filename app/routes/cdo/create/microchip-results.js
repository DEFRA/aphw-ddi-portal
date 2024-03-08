const { routes, views } = require('../../../constants/cdo/dog')
const ViewModel = require('../../../models/cdo/create/microchip-results')
const { admin } = require('../../../auth/permissions')
const { getMicrochipDetails } = require('../../../session/cdo/dog')

module.exports = [{
  method: 'GET',
  path: `${routes.microchipResults.get}/{dogId?}`,
  options: {
    auth: { scope: [admin] },
    handler: async (request, h) => {
      const details = getMicrochipDetails(request)

      return h.view(views.microchipResults, new ViewModel(details))
    }
  }
}]
