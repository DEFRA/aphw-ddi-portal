const { get } = require('../ddi-events-api/base')

const options = {
  json: true
}
const getEvents = async (indexNumber) => {
  return get(`events/${indexNumber}`, options)
}

module.exports = {
  getEvents
}
