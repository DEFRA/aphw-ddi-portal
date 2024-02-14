const config = require('../../config')
const wreck = require('@hapi/wreck')

const baseUrl = config.ddiEventsApi.baseUrl

const get = async (endpoint, user) => {
  const options = { json: true }

  const { payload } = await wreck.get(`${baseUrl}/${endpoint}`, options)

  return payload
}

module.exports = {
  get
}
