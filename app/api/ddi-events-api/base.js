const config = require('../../config')

const wreck = require('@hapi/wreck')
const { buildPostRequest, addHeaders } = require('../shared')
const { NotAuthorizedError } = require('../../errors/notAuthorizedError')
const { ApiErrorFailure } = require('../../errors/apiErrorFailure')

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

const postWithBoom = async (endpoint, data, user) => {
  const options = user?.username
    ? { payload: data, headers: addHeaders(user) }
    : { payload: data }

  const uri = `${baseUrl}/${endpoint}`

  const res = await wreck.request('POST', uri, options)

  const body = await wreck.read(res)

  const responseData = {
    payload: JSON.parse(body.toString()),
    statusCode: res.statusCode,
    statusMessage: res.statusMessage
  }

  if (!res.statusCode.toString().startsWith('2')) {
    throw new ApiErrorFailure(`${res.statusCode} ${res.statusMessage}`, responseData)
  }

  return responseData
}

module.exports = {
  get,
  post,
  postWithBoom,
  callDelete
}
