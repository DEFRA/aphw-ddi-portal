/* istanbul ignore file */
const { get: indexGet } = require('../ddi-index-api/base')

const get = async (endpoint, user) => {
  return indexGet(endpoint, user)
}

module.exports = {
  get
}
