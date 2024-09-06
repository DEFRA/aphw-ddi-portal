const { get } = require('./base')

const countiesEndpoint = 'counties'

const getCounties = async (user) => {
  const payload = await get(countiesEndpoint, user)

  return payload.counties
}

module.exports = {
  getCounties
}
