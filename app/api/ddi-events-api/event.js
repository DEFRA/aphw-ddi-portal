const { get } = require('./base')

const options = {
  json: true
}
const getEvents = async (indexNumber) => {
  return get(`events/${indexNumber}`, options)
}

module.exports = {
  getEvents
}
