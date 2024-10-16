const { get } = require('../ddi-events-api/base')

const getExternalEvents = async (queryString) => {
  return get(`external-events${queryString}`)
}

module.exports = {
  getExternalEvents
}
