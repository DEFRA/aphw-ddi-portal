const config = require('../../config')

const wreck = require('@hapi/wreck')
const { buildPostRequest, addHeaders } = require('../shared')
const { NotAuthorizedError } = require('../../errors/notAuthorizedError')

const baseUrl = config.ddiEventsApi.baseUrl

const get = async (endpoint, user) => {
  const options = user?.username
    ? { headers: addHeaders(user) }
    : {}

  const { payload } = await wreck.get(`${baseUrl}/${endpoint}`, { ...options, json: true })

  return payload
}

const post = buildPostRequest(baseUrl)

const callDelete = async (endpoint, actioningUser) => {
  if (actioningUser === undefined) {
    throw new NotAuthorizedError('User required for this action')
  }
  const options = { headers: addHeaders(actioningUser) }

  return wreck.delete(`${baseUrl}/${endpoint}`, options)
}

module.exports = {
  get,
  post,
  callDelete
}
