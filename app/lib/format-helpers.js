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
  if (containsPossibleInjectedCode(`${details.name}${details.breed}${details.indexNumber}${details.microchipNumber}${details.microchipNumber2}`)) {
    return 'Possible injected code'
  }

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
  if (details.microchipNumber2) {
    const microchipNumber2 = `Microchip number 2: ${details.microchipNumber2}`
    hintLines.push(`${hintStart}${microchipNumber2}${hintEnd}`)
  }
  return `${details.name ? details.name : ''}${hintLines.join('')}`
}

const containsPossibleInjectedCode = str => {
  return str && (str.indexOf('<') > -1 || str.indexOf('>') > -1)
}

module.exports = {
  formatAddress,
  mapOsCountryCodeToCountry,
  getCountryFromAddress,
  formatAddressSingleLine,
  formatDogRadioAsHtml,
  containsPossibleInjectedCode
}
