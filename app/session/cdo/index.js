const { keys } = require('../../constants/cdo')
const { clearAllDogs, setExistingDogs, setMicrochipResults } = require('./dog')
const { setOwnerDetails, setAddress, setEnforcementDetails } = require('./owner')
const { clearAllRouteFlags } = require('../routes')

const get = (request, entryKey, key) => {
  return key ? request.yar?.get(entryKey)?.[key] : request.yar?.get(entryKey)
}

const set = (request, entryKey, key, value) => {
  const entryValue = request.yar.get(entryKey) || {}
  entryValue[key] = typeof (value) === 'string' ? value.trim() : value
  request.yar.set(entryKey, entryValue)
}

const getCreatedCdo = (request) => {
  return get(request, keys.createdCdo)
}

const setCreatedCdo = (request, cdo) => {
  request.yar.set(keys.createdCdo, cdo)
}

const clearCdo = (request) => {
  clearAllDogs(request)
  setExistingDogs(request, [])
  setMicrochipResults(request, [])
  setOwnerDetails(request, null)
  setAddress(request, null)
  setEnforcementDetails(request, null)
  clearAllRouteFlags(request)
}

module.exports = {
  getCreatedCdoKey: get,
  getCreatedCdo,
  setCreatedCdo,
  clearCdo,
  get,
  set
}
