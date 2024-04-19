/**
 *
 * @param {Address} address
 * @param {boolean} hideCountry
 * @returns {*[]|null}
 */
const formatAddress = (address, hideCountry = false) => {
  if (!address) {
    return null
  }

  const keys = ['addressLine1', 'addressLine2', 'town', 'postcode', 'country']

  return keys.reduce((parts, key) => {
    if (address[key] && (key !== 'country' || !hideCountry)) {
      return [...parts, address[key]]
    }
    return parts
  }, [])
}

const formatAddressSingleLine = (address) => {
  if (!address) {
    return null
  }

  const updatedAddress = { ...address }

  return formatAddress(updatedAddress, true).join(', ')
}

/**
 *
 * @param {Address} address
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

const formatDogRadioAsHtml = (details) => {
  const hintStart = '<div class="govuk-hint defra-radio-text-block">'
  const hintEnd = '</div>'
  const hintLines = [
    `${hintStart}Breed: ${details.breed}${hintEnd}`,
    `${hintStart}Index number: ${details.indexNumber}${hintEnd}`
  ]
  if (details.microchipNumber) {
    const microchipNumber = `Microchip number: ${details.microchipNumber}`
    hintLines.push(`${hintStart}${microchipNumber}${hintEnd}`)
  }
  return `${details.name ? details.name : ''}${hintLines.join('')}`
}

module.exports = {
  formatAddress,
  mapOsCountryCodeToCountry,
  getCountryFromAddress,
  formatAddressSingleLine,
  formatDogRadioAsHtml
}
