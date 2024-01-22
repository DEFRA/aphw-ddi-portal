const config = require('../../config')

const wreck = require('@hapi/wreck')

const baseUrl = config.ddiIndexApi.baseUrl

const get = async (endpoint, user) => {
  const options = user?.username ? { json: true, headers: { 'ddi-username': user?.username } } : { json: true }

  const { payload } = await wreck.get(`${baseUrl}/${endpoint}`, options)

  return payload
}

const post = async (endpoint, data, user) => {
  const options = user?.username
    ? { payload: data, headers: { 'ddi-username': user?.username } }
    : { payload: data }

  const { payload } = await wreck.post(`${baseUrl}/${endpoint}`, options)

  return JSON.parse(payload)
}

const put = async (endpoint, data, user) => {
  const options = user?.username
    ? { payload: data, headers: { 'ddi-username': user?.username } }
    : { payload: data }

  const { payload } = await wreck.put(`${baseUrl}/${endpoint}`, options)

  return JSON.parse(payload)
}

module.exports = {
  get,
  post,
  put
}
