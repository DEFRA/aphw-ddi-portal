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

  const foundAddresses = payload.results.map(result => ({
    addressLine1: `${result.DPA.BUILDING_NUMBER} ${result.DPA.THOROUGHFARE_NAME}`,
    addressTown: result.DPA.POST_TOWN,
    addressPostcode: postcode
  }))

  return foundAddresses
}

module.exports = {
  getPostcodeAddresses
}
