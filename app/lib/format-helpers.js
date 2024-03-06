/**
 *
 * @param {{
 *    addressLine1: string;
 *    addressLine2: string;
 *    town: string;
 *    postcode: string;
 *    country: string;
 * }} address
 * @param {boolean} hideCountry
 * @returns {*[]|null}
 */
const formatAddress = (address, hideCountry = false) => {
  if (!address) {
    return null
  }

  const parts = []

  Object.keys(address).forEach(key => {
    const includeField = key !== 'country' || hideCountry === false

    if (address[key] && includeField) {
      parts.push(address[key])
    }
  })

  return parts
}

/**
 *
 * @param {{
 *    addressLine1: string;
 *    addressLine2: string;
 *    town: string;
 *    postcode: string;
 *    country: string;
 * }} address
 * @returns {string|null}
 */
const getCountryFromAddress = (address) => {
  return address?.country || null
}

const countryCodeMap = {
  E: 'England',
  S: 'Scotland',
  W: 'Wales'
}

const mapOsCountryCodeToCountry = (osPlacesCountryCode) => {
  const country = countryCodeMap[osPlacesCountryCode]

  if (country !== undefined) {
    return country
  }

  return undefined
}

module.exports = {
  formatAddress,
  mapOsCountryCodeToCountry,
  getCountryFromAddress
}
