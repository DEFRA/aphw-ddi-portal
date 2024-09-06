const { get } = require('./base')

const documentationEndpoint = 'swagger.json'

/**
 * @param user
 * @return {Promise<unknown>}
 */
const getDocumentation = async (user) => {
  const payload = await get(documentationEndpoint, user)

  return payload
}

module.exports = {
  getDocumentation
}
