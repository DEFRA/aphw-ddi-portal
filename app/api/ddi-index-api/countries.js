const { get } = require('./base')

const countriesEndpoint = 'countries'

/**
 * @param user
 * @return {Promise<*>}
 */
const getCountries = async (user) => {
  const payload = await get(countriesEndpoint, user)

  return payload.countries
}

module.exports = {
  getCountries
}
