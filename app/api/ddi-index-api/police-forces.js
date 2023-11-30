const { get } = require('./base')

const policeForcesEndpoint = 'police-forces'

const options = {
  json: true
}

const getPoliceForces = async () => {
  const payload = await get(policeForcesEndpoint, options)

  return payload.policeForces
}

module.exports = {
  getPoliceForces
}
