const { get } = require('../ddi-events-api/base')

const getEvents = async (indexNumbers) => {
  return get(`events/?pks=${indexNumbers.join(',')}`, {
    json: true
  })
}

module.exports = {
  getEvents
}
