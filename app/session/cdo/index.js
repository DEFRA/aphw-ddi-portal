const { keys } = require('../../constants/cdo')
const { clearAllDogs } = require('./dog')
const { setOwnerDetails, setAddress, setEnforcementDetails } = require('./owner')

const get = (request, entryKey, key) => {
  return key ? request.yar?.get(entryKey)?.[key] : request.yar?.get(entryKey)
}

const getCreatedCdo = (request) => {
  return get(request, keys.createdCdo)
}

const setCreatedCdo = (request, cdo) => {
  request.yar.set(keys.createdCdo, cdo)
}

const clearCdo = (request) => {
  clearAllDogs(request)
  setOwnerDetails(request, null)
  setAddress(request, null)
  setEnforcementDetails(request, null)
}

module.exports = {
  getCreatedCdo,
  setCreatedCdo,
  clearCdo
}
