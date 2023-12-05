const config = require('../config')
const wreck = require('@hapi/wreck')
const { getPoliceForces } = require('../api/ddi-index-api/police-forces')

const osBaseUrl = config.osPlacesApi.baseUrl
const policeBaseUrl = config.policeApi.baseUrl
const postcodeEndpoint = 'postcode'
const policeLocationEndpoint = 'locate-neighbourhood'

const osPlacesOptions = {
  headers: {
    key: config.osPlacesApi.token
  },
  json: true
}

const policeApiOptions = {
  json: true
}

const getPostcodeLongLat = async (postcode) => {
  try {
    const { payload } = await wreck.get(`${osBaseUrl}/${postcodeEndpoint}?postcode=${postcode}&output_srs=WGS84`, osPlacesOptions)

    // Only grab first result, even if many
    return payload.results && payload.results.length > 0
      ? { lng: payload.results[0].DPA.LNG, lat: payload.results[0].DPA.LAT }
      : null
  } catch (e) {
    console.log(e)
    return null
  }
}

const getPoliceForce = async coords => {
  let retries = 0
  while (retries < 3) {
    try {
      const { payload } = await wreck.get(`${policeBaseUrl}/${policeLocationEndpoint}?q=${coords.lat},${coords.lng}`, policeApiOptions)
      // Only grab first result, even if many
      return payload?.force
    } catch (e) {
      if (e?.output?.statusCode === 429) {
        // Rate limiting
        retries++
        console.log('Rate limiting on Police API')
        await new Promise(resolve => setTimeout(resolve, 500))
        continue
      }
      console.log('Error calling Police API', e)
      return null
    }
  }
  return null
}

const matchPoliceForceByName = async (name) => {
  if (name == null) {
    return null
  }
  const policeForces = await getPoliceForces()
  // Police Force name may include hyphens to separate the words, so replace all hyphens with spaces
  return policeForces.find(x => x.name.toLowerCase().indexOf(name.replace(/-/g, ' ')) > -1)
}

const lookupPoliceForceByPostcode = async postcode => {
  const coords = await getPostcodeLongLat(postcode)
  const policeForceName = await getPoliceForce(coords)
  return await matchPoliceForceByName(policeForceName)
}

module.exports = {
  lookupPoliceForceByPostcode,
  getPostcodeLongLat,
  matchPoliceForceByName,
  getPoliceForce
}
