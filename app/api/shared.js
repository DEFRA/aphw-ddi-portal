const wreck = require('@hapi/wreck')
const addHeaders = (user) => ({
  'ddi-username': user?.username, 'ddi-displayname': user?.displayname
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
