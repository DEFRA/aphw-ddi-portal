const Joi = require('joi')
const { routes, views } = require('../../../constants/cdo/dog')
const { routes: ownerRoutes } = require('../../../constants/cdo/owner')
const ViewModel = require('../../../models/cdo/create/microchip-search')
const { getDog, setDog, setMicrochipResults, getDogs } = require('../../../session/cdo/dog')
const { anyLoggedInUser } = require('../../../auth/permissions')
const { validatePayload } = require('../../../schema/portal/cdo/microchip-search')
const { doSearch } = require('../../../api/ddi-index-api/search')
const { getOwnerDetails } = require('../../../session/cdo/owner')
const { logValidationError } = require('../../../lib/log-helpers')

const alreadyOwnThisDogMessage = 'Dog already registered to this owner'

const backNavStandard = { backLink: ownerRoutes.ownerDetails.get }
const backNavSummary = { backLink: ownerRoutes.fullSummary.get }
const getBackNav = request => {
  return request?.query?.fromSummary === 'true' ? backNavSummary : backNavStandard
}

module.exports = [{
  method: 'GET',
  path: `${routes.microchipSearch.get}/{dogId?}`,
  options: {
    auth: { scope: anyLoggedInUser },
    handler: async (request, h) => {
      const dog = getDog(request)

      if (dog === undefined) {
        return h.response().code(404).takeover()
      }

      dog.dogId = determineDogId(request, dog)

      return h.view(views.microchipSearch, new ViewModel(dog, getBackNav(request)))
    }
  }
},
{
  method: 'POST',
  path: `${routes.microchipSearch.post}/{dogId?}`,
  options: {
    auth: { scope: anyLoggedInUser },
    validate: {
      payload: validatePayload,
      failAction: async (request, h, error) => {
        logValidationError(error, routes.microchipSearch.post)
        const details = { ...getDog(request), ...request.payload }

        details.dogId = determineDogId(request, details)

        return h.view(views.microchipSearch, new ViewModel(details, getBackNav(request), error)).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const details = { ...getDog(request), ...request.payload }
      details.dogId = determineDogId(request, details)

      const duplicateMicrochipMessage = duplicateMicrochipsInSession(request, details)
      if (duplicateMicrochipMessage) {
        return h.view(views.microchipSearch, new ViewModel(details, getBackNav(request), generateMicrochipError(duplicateMicrochipMessage))).code(400).takeover()
      }

      const results = await doSearch({ searchType: 'dog', searchTerms: details.microchipNumber })

      if (isDogUnderSameOwner(results, details, request)) {
        return h.view(views.microchipSearch, new ViewModel(details, getBackNav(request), generateMicrochipError(alreadyOwnThisDogMessage))).code(400).takeover()
      }

      const searchResults = { results, microchipNumber: details.microchipNumber }
      setMicrochipResults(request, searchResults)

      if (searchResults.results.length === 0) {
        setDog(request, details)
      }

      return h.redirect(searchResults.results.length > 0 ? `${routes.microchipResults.get}/${details.dogId}` : `${routes.details.get}/${details.dogId}`)
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

const isDogUnderSameOwner = (results, details, request) => {
  const owner = getOwnerDetails(request)
  return results.some(result => (result.microchipNumber === details.microchipNumber || result.microchipNumber2 === details.microchipNumber) &&
  result.personReference === owner.personReference)
}

const generateMicrochipError = message => {
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
