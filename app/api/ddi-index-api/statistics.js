const { get } = require('./base')

const endpoint = 'statistics'

/**
 * @param queryName
 * @param user
 * @return {Promise<unknown>}
 */
const getStatistics = async (queryName, user) => {
  const payload = await get(`${endpoint}?queryName=${queryName}`, user)

  return payload
}

module.exports = {
  getStatistics
}
