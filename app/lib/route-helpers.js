const { setPostcodeLookupDetails } = require('../session/cdo/owner')
const { setInSession } = require('../session/session-wrapper')
const { routes, keys } = require('../constants/cdo/owner')
const { addBackNavigation } = require('./back-helpers')

const throwIfPreConditionError = (request) => {
  for (const [key, value] of Object.entries(request.pre ?? {})) {
    if (value instanceof Error) {
      console.error(`Failed at pre step ${key}`, value)
      throw value
    }
  }
}

const crossedBorderOutOfScotland = (oldCountry, newCountry) => {
  return oldCountry === 'Scotland' && (newCountry === 'England' || newCountry === 'Wales')
}

const crossedBorderIntoScotland = (oldCountry, newCountry) => {
  return (oldCountry === 'England' || oldCountry === 'Wales') && newCountry === 'Scotland'
}

const createdCrossBorderResult = (policeResult, country, personReference, countryChanged = false) => {
  return {
    policeResult,
    country,
    personReference,
    countryChanged
  }
}

const determineNextScreenAfterAddressChange = (request, oldCountry, newCountry, policeResult, personReference, defaultRoute) => {
  const backNav = addBackNavigation(request)
  if (crossedBorderIntoScotland(oldCountry, newCountry) || crossedBorderOutOfScotland(oldCountry, newCountry)) {
    const result = createdCrossBorderResult(policeResult, newCountry, personReference, true)
    setInSession(request, keys.policeForceChangedResult, result)
    return `${routes.countryChanged.get}${backNav.srcHashParam}`
  }

  if (policeResult?.policeForceResult?.changed) {
    const result = createdCrossBorderResult(policeResult, newCountry, personReference)
    setInSession(request, keys.policeForceChangedResult, result)
    return routes.policeForceChanged.get
  } else if (policeResult?.policeForceResult?.reason === 'Not found') {
    const result = createdCrossBorderResult(policeResult, newCountry, personReference)
    setInSession(request, keys.policeForceChangedResult, result)
    return `${routes.policeForceNotFound.get}/${personReference}`
  } else {
    setInSession(request, keys.policeForceChangedResult, null)
    setPostcodeLookupDetails(request, null)
    setInSession(request, 'addresses', null)
    return defaultRoute
  }
}

module.exports = {
  throwIfPreConditionError,
  determineNextScreenAfterAddressChange
}
