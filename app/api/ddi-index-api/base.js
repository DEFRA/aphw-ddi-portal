const config = require('../../config')

const wreck = require('@hapi/wreck')

const baseUrl = config.ddiIndexApi.baseUrl

const get = async (endpoint, user) => {
  const { payload } = await wreck.get(`${baseUrl}/${endpoint}`, {
    json: true,
    headers: { 'ddi-username': user?.username ?? 'local' }
  })

  return payload
}

const post = async (endpoint, data, user) => {
  const { payload } = await wreck.post(`${baseUrl}/${endpoint}`, {
    payload: data,
    headers: { 'ddi-username': user?.username ?? 'local' }
  })

  return JSON.parse(payload)
}

const put = async (endpoint, data, user) => {
  const { payload } = await wreck.put(`${baseUrl}/${endpoint}`, {
    payload: data,
    headers: { 'ddi-username': user?.username ?? 'local' }
  })

  return JSON.parse(payload)
}

module.exports = {
  get,
  post,
  put
}
