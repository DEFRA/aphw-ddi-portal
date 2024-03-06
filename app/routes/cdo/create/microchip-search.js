const { routes, views } = require('../../../constants/cdo/dog')
const ViewModel = require('../../../models/cdo/create/microchip-search')
const { getDog } = require('../../../session/cdo/dog')
const { admin } = require('../../../auth/permissions')
const { validatePayload } = require('../../../schema/portal/cdo/microchip-search')

module.exports = [{
  method: 'GET',
  path: `${routes.microchipSearch.get}/{dogId?}`,
  options: {
    auth: { scope: [admin] },
    handler: async (request, h) => {
      const dog = getDog(request)

      if (dog === undefined) {
        return h.response().code(404).takeover()
      }

      dog.id = request.params.dogId

      return h.view(views.microchipSearch, new ViewModel(dog))
    }
  }
},
{
  method: 'POST',
  path: routes.microchipSearch.post,
  options: {
    auth: { scope: [admin] },
    validate: {
      payload: validatePayload,
      failAction: async (request, h, error) => {
        console.log('microchip fail post')
        const details = { ...getDog(request), ...request.payload }
        console.log('microchip fail details', details)
        return h.view(views.ownerDetails, new ViewModel(details, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const details = request.payload
      console.log('details', details)
      // setMicrochipDetails(request, details)

      return h.redirect(routes.selectAddress.get)
    }
  }
}]
