const { get } = require('../ddi-events-api/base')

const getEvents = async (primaryKeys, user) => {
  return get(`events?pks=${primaryKeys.join(',')}`, user)
}

module.exports = {
  getEvents
}
