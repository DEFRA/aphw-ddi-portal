const getFromSession = (request, keyName) => {
  return request.yar.get(keyName)
}

const setInSession = (request, keyName, keyValue) => {
  request.yar.set(keyName, keyValue)
}

module.exports = {
  getFromSession,
  setInSession
}
