const config = require('../config')
const wreck = require('@hapi/wreck')

const baseUrl = config.osPlacesApi.baseUrl
const postcodeEndpoint = 'postcode'

const options = {
  headers: {
    key: config.osPlacesApi.token
  },
  json: true
}

const getPostcodeAddresses = async postcode => {
  const { payload } = await wreck.get(`${baseUrl}/${postcodeEndpoint}?postcode=${postcode}`, options)

  const foundAddresses = payload.results.map(result => {
    const subBuilding = result.DPA.SUB_BUILDING_NAME ? `${result.DPA.SUB_BUILDING_NAME},` : ''
    return {
      addressLine1: `${subBuilding} ${result.DPA.BUILDING_NUMBER} ${result.DPA.THOROUGHFARE_NAME}`,
      addressTown: result.DPA.POST_TOWN,
      addressPostcode: postcode
    }
  })

  return foundAddresses
}

module.exports = {
  getPostcodeAddresses
}
