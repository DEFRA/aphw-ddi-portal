const config = require('../../config')

const wreck = require('@hapi/wreck')
const { addHeaders, buildPostRequest } = require('../shared')
const { ApiErrorFailure } = require('../../errors/api-error-failure')

const baseUrl = config.ddiIndexApi.baseUrl

const get = async (endpoint, user) => {
  const options = user?.username ? { json: true, headers: addHeaders(user) } : { json: true }
  const { payload } = await wreck.get(`${baseUrl}/${endpoint}`, options)

  return payload
}

const post = buildPostRequest(baseUrl)

const put = async (endpoint, data, user) => {
  const options = user?.username
    ? { payload: data, headers: addHeaders(user) }
    : { payload: data }

  const { payload } = await wreck.put(`${baseUrl}/${endpoint}`, options)

  return JSON.parse(payload)
}

const callDelete = async (endpoint, user) => {
  const options = user?.username ? { json: true, headers: addHeaders(user) } : { json: true }

  const { payload } = await wreck.delete(`${baseUrl}/${endpoint}`, options)

  return payload
}

const boomRequest = async (endpoint, method, data, user) => {
  const options = user?.username
    ? { payload: data, headers: addHeaders(user) }
    : { payload: data }

  const uri = `${baseUrl}/${endpoint}`

  const res = await wreck.request(method, uri, options)

  const body = await wreck.read(res)

  const payload = body.toString().length > 0 ? JSON.parse(body.toString()) : undefined

  const responseData = {
    payload,
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
  put,
  callDelete,
  boomRequest
}
