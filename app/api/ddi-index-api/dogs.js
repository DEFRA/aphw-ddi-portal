const { get } = require('./base')

const dogsEndpoint = 'dogs'

const options = {
  json: true
}

const getOldDogs = async () => {
  const payload = await get(`${dogsEndpoint}?forPurging=true`, options)
  return payload
}

module.exports = {
  getOldDogs
}
