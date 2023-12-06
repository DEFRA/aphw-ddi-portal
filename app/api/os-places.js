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
  try {
    const { payload } = await wreck.get(`${baseUrl}/${postcodeEndpoint}?postcode=${postcode}`, options)

    const foundAddresses = payload.results.flatMap(result => {
      if (houseNumber) {
        if (houseNumber.toLowerCase() === `${result.DPA.BUILDING_NUMBER}`.toLowerCase() ||
          houseNumber.toLowerCase() === `${result.DPA.SUB_BUILDING_NAME}`.toLowerCase() ||
          `flat ${houseNumber.toLowerCase()}` === `${result.DPA.SUB_BUILDING_NAME}`.toLowerCase()) {
          return buildAddressResult(result)
        } else {
          return []
        }
      }
      return buildAddressResult(result)
    })

    return foundAddresses.sort((a, b) => {
      // Sort function to cater for 'FLAT' numbers alongside house numbers
      if (a.sorting < b.sorting) {
        return -1
      } else if (a.sorting > b.sorting) {
        return 1
      }
      return 0
    })
  } catch (e) {
    console.log(e)
    return []
  }
}

const buildAddressResult = (result) => {
  const subBuilding = result.DPA.SUB_BUILDING_NAME ? `${result.DPA.SUB_BUILDING_NAME}, ` : ''
  const buildingName = result.DPA.BUILDING_NAME ? `${result.DPA.BUILDING_NAME}, ` : ''
  const buildingNumber = result.DPA.BUILDING_NUMBER ? `${result.DPA.BUILDING_NUMBER} ` : ''
  return {
    addressLine1: `${subBuilding}${buildingName}${buildingNumber}${result.DPA.THOROUGHFARE_NAME}`,
    addressLine2: result.DPA.DEPENDENT_LOCALITY,
    addressTown: result.DPA.POST_TOWN,
    addressPostcode: result.DPA.POSTCODE,
    addressCountry: result.DPA.COUNTRY_CODE,
    sorting: `${leftPad(result.DPA.BUILDING_NUMBER)} ${leftPad(result.DPA.SUB_BUILDING_NAME)}`
  }
}

const leftPad = propName => {
  if (!propName) {
    return '0000'
  }

  let propNumber
  try {
    propNumber = parseInt(propName.toLowerCase().replace('flat ', ''))
  } catch {
  }

  return propNumber ? propNumber.toString().padStart(4, '0') : '0000'
}

const getPostcodeLongLat = async (postcode) => {
  try {
    const { payload } = await wreck.get(`${baseUrl}/${postcodeEndpoint}?postcode=${postcode}&output_srs=WGS84`, options)

    // Only grab first result, even if many
    return payload.results && payload.results.length > 0
      ? { lng: payload.results[0].DPA.LNG, lat: payload.results[0].DPA.LAT }
      : null
  } catch (e) {
    console.log(e)
    return null
  }
}

module.exports = {
  getPostcodeAddresses,
  getPostcodeLongLat
}
