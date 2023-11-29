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
  return {
    addressLine1: `${subBuilding}${result.DPA.BUILDING_NUMBER} ${result.DPA.THOROUGHFARE_NAME}`,
    addressLine2: result.DPA.DEPENDENT_LOCALITY,
    addressTown: result.DPA.POST_TOWN,
    addressPostcode: result.DPA.POSTCODE,
    addressCountry: result.DPA.COUNTRY_CODE,
    sorting: `${result.DPA.BUILDING_NUMBER} ${leftPad(result.DPA.SUB_BUILDING_NAME)}`
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

module.exports = {
  getPostcodeAddresses
}
