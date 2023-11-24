const { get } = require('./base')

const countiesEndpoint = 'counties'

const options = {
  json: true
}

const getCounties = async () => {
  const payload = await get(countiesEndpoint, options)

  return payload.counties
}

module.exports = {
  getCounties
}
