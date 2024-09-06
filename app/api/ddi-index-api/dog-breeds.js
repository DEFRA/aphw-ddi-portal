const { get } = require('./base')

const breedEndpoint = 'dog-breeds'

/**
 * @param user
 * @return {Promise<unknown>}
 */
const getBreeds = async (user) => {
  return get(breedEndpoint, user)
}

module.exports = {
  getBreeds
}
