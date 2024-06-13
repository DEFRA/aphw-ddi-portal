/**
 *
 * @param {Address} address
 * @param {{ hideCountry?: boolean; hideAddressLine2?: boolean; joinPostCode?: boolean }} [options]
 * @returns {*[]|null}
 */
const formatAddress = (address, options = {}) => {
  if (!address) {
    return null
  }

  let keys = ['addressLine1', 'addressLine2', 'town', 'postcode', 'country']

  if (options.joinPostCode === true) {
    keys = ['addressLine1', 'addressLine2', ['town', 'postcode'], 'country']
  }

  return keys.reduce((parts, key) => {
    if (Array.isArray(key)) {
      const subKeys = key.map(k => address[k])
      return [...parts, subKeys.join(' ')]
    } else if (
      address[key] &&
      (key !== 'country' || !options.hideCountry) &&
      (key !== 'addressLine2' || !options.hideAddressLine2)
    ) {
      return [...parts, address[key]]
    }
    return parts
  }, [])
}

const formatAddressSingleLine = (address, simple = false) => {
  if (!address) {
    return null
  }

  const options = {
    hideCountry: true, joinPostCode: true
  }

  if (simple) {
    options.hideAddressLine2 = true
  }

  const updatedAddress = { ...address }
  return formatAddress(updatedAddress, options).join(', ')
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

const formatNumberWithCommas = num => {
  return typeof num === 'number' ? num.toLocaleString('en-GB') : parseInt(num).toLocaleString('en-GB')
}

module.exports = {
  formatAddress,
  mapOsCountryCodeToCountry,
  getCountryFromAddress,
  formatAddressSingleLine,
  formatDogRadioAsHtml,
  containsPossibleInjectedCode,
  formatNumberWithCommas
}
