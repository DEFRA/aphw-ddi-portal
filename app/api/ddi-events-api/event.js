const { get } = require('../ddi-events-api/base')

const options = {
  json: true
}
const getEvents = async (indexNumbers) => {
  return get(`events/?pks=${indexNumbers.join(',')}`, options)
}

module.exports = {
  getEvents
}
