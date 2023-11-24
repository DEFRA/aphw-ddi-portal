const { get } = require('./base')

const countriesEndpoint = 'countries'

const options = {
  json: true
}

const getCountries = async () => {
  const payload = await get(countriesEndpoint, options)

  return payload.countries
}

module.exports = {
  getCountries
}
