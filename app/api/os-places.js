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

const getPostcodeAddresses = async (postcode, houseNumber) => {
  const { payload } = await wreck.get(`${baseUrl}/${postcodeEndpoint}?postcode=${postcode}`, options)

  const foundAddresses = payload.results.flatMap(result => {
    if (houseNumber &&
       (houseNumber.toLowerCase() === result.DPA.BUILDING_NUMBER?.toLowerCase() ||
        houseNumber.toLowerCase() === result.DPA.SUB_BUILDING_NAME?.toLowerCase())) {
      return buildAddressResult(result)
    }
    if (!houseNumber) {
      return buildAddressResult(result)
    }
    return []
  })

  return foundAddresses
}

const buildAddressResult = (result) => {
  const subBuilding = result.DPA.SUB_BUILDING_NAME ? `${result.DPA.SUB_BUILDING_NAME}, ` : ''
  return {
    addressLine1: `${subBuilding}${result.DPA.BUILDING_NUMBER} ${result.DPA.THOROUGHFARE_NAME}`,
    addressTown: result.DPA.POST_TOWN,
    addressPostcode: result.DPA.POSTCODE,
    addressCountry: result.DPA.COUNTRY_CODE
  }
}

module.exports = {
  getPostcodeAddresses
}
