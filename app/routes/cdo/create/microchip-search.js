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

      dog.dogId = determineDogId(request, dog)

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

        details.dogId = determineDogId(request, details)

        return h.view(views.microchipSearch, new ViewModel(details, error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const details = { ...getDog(request), ...request.payload }
      details.dogId = determineDogId(request, details)

      const duplicateMicrochipMessage = duplicateMicrochipsInSession(request, details)
      if (duplicateMicrochipMessage) {
        return h.view(views.microchipSearch, new ViewModel(details, generateDuplicateError(duplicateMicrochipMessage))).code(400).takeover()
      }

      const results = await doSearch({ searchType: 'dog', searchTerms: details.microchipNumber })

      setMicrochipResults(request, results)

      if (results.length === 0) {
        setDog(request, details)
      }

      return h.redirect(results.length > 0 ? `${routes.microchipResults.get}/${details.dogId}` : `${routes.details.get}/${details.dogId}`)
    }
  }
}]

const duplicateMicrochipsInSession = (request, details) => {
  const dogs = getDogs(request)
  if (dogs) {
    dogs.forEach((d, ind) => { d.dogId = d.dogId || `${ind + 1}` })
    const dupeDogs = dogs.filter(d => d.microchipNumber === details.microchipNumber && `${d.dogId}` !== `${details.dogId}`)
    if (dupeDogs.length) {
      const dogName = dupeDogs[0].name ? ` (${dupeDogs[0].name})` : ''
      return `This microchip number has already been used by Dog ${dupeDogs[0].dogId}${dogName}`
    }
  }

  return null
}

const generateDuplicateError = message => {
  return new Joi.ValidationError(message, [{ message, path: ['microchipNumber'] }])
}

const getLatestDogIndex = (request) => {
  if (getDogs(request)) {
    return getDogs(request)?.filter(x => x.applicationType).length + 1
  }

  return 1
}

const determineDogId = (request, details) => {
  return (request.params.dogId ?? null) || (details.dogId ?? null) || getLatestDogIndex(request)
}
