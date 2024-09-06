const wreck = require('@hapi/wreck')
const { createBearerHeader } = require('../auth/jwt-utils')

const { audiences } = require('../constants/auth')
const addHeaders = (user, _request) => ({
  'ddi-username': user?.username,
  'ddi-displayname': user?.displayname,
  ...createBearerHeader(audiences.api)(user)
})

const buildPostRequest = (baseUrl) => async (endpoint, data, user) => {
  const options = user?.username
    ? { payload: data, headers: addHeaders(user) }
    : { payload: data }

  const { payload } = await wreck.post(`${baseUrl}/${endpoint}`, options)

  if (!payload.toString().length > 0) {
    return
  }

  return JSON.parse(payload)
}

module.exports = {
  addHeaders,
  buildPostRequest
}
