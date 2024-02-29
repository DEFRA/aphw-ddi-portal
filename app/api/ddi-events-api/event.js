const { get } = require('../ddi-events-api/base')

const getEvents = async (primaryKeys) => {
  return get(`events?pks=${primaryKeys.join(',')}`)
}

module.exports = {
  getEvents
}
