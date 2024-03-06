const { routes, views } = require('../../../constants/cdo/dog')
const ViewModel = require('../../../models/cdo/create/microchip-search')
const { getDog, getMicrochipDetails } = require('../../../session/cdo/dog')
const { admin } = require('../../../auth/permissions')
const { validatePayload } = require('../../../schema/portal/cdo/microchip-search')
const { setMicrochipDetails } = require('../../../session/cdo/dog')
const { doSearch } = require('../../../api/ddi-index-api/search')

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
      dog.microchipNumber = getMicrochipDetails(request).microchipNumber

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
        const details = { ...getDog(request), ...request.payload }
        return h.view(views.microchipSearch, new ViewModel(details, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const details = request.payload

      details.results = await doSearch({ searchType: 'dog', searchTerms: details.microchipNumber })

      setMicrochipDetails(request, details)

      return h.redirect(details.results.length > 0 ? routes.microchipResults.get : routes.details.get)
    }
  }
}]
