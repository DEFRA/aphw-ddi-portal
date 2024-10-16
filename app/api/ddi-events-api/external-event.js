const { get } = require('../ddi-events-api/base')

const getExternalEvents = async (queryString, user) => {
  return get(`external-events${queryString}`, user)
}

module.exports = {
  getExternalEvents
}
