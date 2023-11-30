const { get } = require('./base')

const courtsEndpoint = 'courts'

const options = {
  json: true
}

const getCourts = async () => {
  const payload = await get(courtsEndpoint, options)

  return payload.courts
}

module.exports = {
  getCourts
}
