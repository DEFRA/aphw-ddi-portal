const config = require('../../config')

const wreck = require('@hapi/wreck')

const baseUrl = config.ddiIndexApi.baseUrl

const get = async (endpoint, user) => {
  const options = user?.username ? { json: true, headers: addHeaders(user) } : { json: true }

  const { payload } = await wreck.get(`${baseUrl}/${endpoint}`, options)

  return payload
}

const post = async (endpoint, data, user) => {
  const options = user?.username
    ? { payload: data, headers: addHeaders(user) }
    : { payload: data }

  const { payload } = await wreck.post(`${baseUrl}/${endpoint}`, options)

  return JSON.parse(payload)
}

const put = async (endpoint, data, user) => {
  const options = user?.username
    ? { payload: data, headers: addHeaders(user) }
    : { payload: data }

  const { payload } = await wreck.put(`${baseUrl}/${endpoint}`, options)

  return JSON.parse(payload)
}

const addHeaders = (user) => ({
  'ddi-username': user?.username, 'ddi-displayname': user?.displayname
})

module.exports = {
  get,
  post,
  put
}
