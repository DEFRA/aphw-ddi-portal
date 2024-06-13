const { get } = require('./base')

const endpoint = 'statistics'

const options = {
  json: true
}

const getStatistics = async (queryName) => {
  const payload = await get(`${endpoint}?queryName=${queryName}`, options)

  return payload
}

module.exports = {
  getStatistics
}
