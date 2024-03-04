const formatAddress = (address) => {
  if (!address) {
    return null
  }

  const parts = []

  Object.keys(address).forEach(key => {
    if (address[key]) {
      parts.push(address[key])
    }
  })

  return parts
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
  mapOsCountryCodeToCountry
}
