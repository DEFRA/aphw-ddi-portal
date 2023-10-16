const config = require('../../config')
const wreck = require('@hapi/wreck')

const baseUrl = config.ddaIndexApi.baseUrl

const options = {
  json: true
}

const get = async endpoint => {
  const { payload } = await wreck.get(`${baseUrl}/${endpoint}`, options)

  return payload
}

module.exports = {
  get
}
