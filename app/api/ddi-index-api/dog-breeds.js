const { get } = require('./base')

const breedEndpoint = 'dog-breeds'

const options = {
  json: true
}

const getBreeds = async () => {
  const payload = await get(breedEndpoint, options)

  return payload
}

module.exports = {
  getBreeds
}
