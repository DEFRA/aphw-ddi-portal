const wreck = require('@hapi/wreck')
const { createBearerHeader } = require('../auth/jwt-utils')

const { audiences } = require('../constants/auth')
const addHeaders = (user, _request) => ({
  'ddi-username': user?.username,
  'ddi-displayname': user?.displayname,
  ...createBearerHeader(audiences.api)(user)
})

const addHeadersEvents = (user) => ({
  'ddi-username': user?.username,
  'ddi-displayname': user?.displayname,
  ...createBearerHeader(audiences.events)(user)
})

const buildPostRequest = (baseUrl, audience) => async (endpoint, data, user) => {
  const options = user?.username
    ? { payload: data, headers: audience === 'events' ? addHeadersEvents(user) : addHeaders(user) }
    : { payload: data }

  const { payload } = await wreck.post(`${baseUrl}/${endpoint}`, options)

  if (!payload.toString().length > 0) {
    return
  }

  return JSON.parse(payload)
}

module.exports = {
  addHeaders,
  buildPostRequest,
  addHeadersEvents
}
