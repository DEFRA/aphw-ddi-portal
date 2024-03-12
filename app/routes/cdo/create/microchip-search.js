const Joi = require('joi')
const { routes, views } = require('../../../constants/cdo/dog')
const ViewModel = require('../../../models/cdo/create/microchip-search')
const { getDog, setDog, setMicrochipResults, getDogs } = require('../../../session/cdo/dog')
const { admin } = require('../../../auth/permissions')
const { validatePayload } = require('../../../schema/portal/cdo/microchip-search')
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

      return h.view(views.microchipSearch, new ViewModel(dog))
    }
  }
},
{
  method: 'POST',
  path: `${routes.microchipSearch.post}/{dogId?}`,
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
      const details = { ...getDog(request), ...request.payload }

      const duplicateMicrochipMessage = duplicateMicrochipsInSession(request, details)
      if (duplicateMicrochipMessage) {
        const error = new Joi.ValidationError(duplicateMicrochipMessage, [{ message: duplicateMicrochipMessage, path: ['microchipNumber'] }])
        return h.view(views.microchipSearch, new ViewModel(details, error)).code(400).takeover()
      }

      const results = await doSearch({ searchType: 'dog', searchTerms: details.microchipNumber })

      setMicrochipResults(request, results)

      if (results.length === 0) {
        setDog(request, details)
      }

      return h.redirect(results.length > 0 ? routes.microchipResults.get : routes.details.get)
    }
  }
}]

const duplicateMicrochipsInSession = (request, details) => {
  const dogs = getDogs(request)
  if (dogs) {
    dogs.forEach((d, ind) => { d.id = ind + 1 })
    const dupeDogs = dogs.filter(d => d.microchipNumber === details.microchipNumber)
    if (dupeDogs.length) {
      const dogName = dupeDogs[0].name ? ` (${dupeDogs[0].name})` : ''
      return `This microchip number has already been used by Dog ${dupeDogs[0].id}${dogName}`
    }
  }

  return null
}
