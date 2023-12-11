const { keys } = require('../../constants/cdo')

const get = (request, entryKey, key) => {
  return key ? request.yar?.get(entryKey)?.[key] : request.yar?.get(entryKey)
}

const getCreatedCdo = (request) => {
  return get(request, keys.createdCdo)
}

const setCreatedCdo = (request, cdo) => {
  request.yar.set(keys.createdCdo, cdo)
}

module.exports = {
  getCreatedCdo,
  setCreatedCdo
}
