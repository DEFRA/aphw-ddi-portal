const { keys } = require('../../constants/cdo/owner')

const set = (request, entryKey, key, value) => {
  const entryValue = request.yar?.get(entryKey) || {}
  entryValue[key] = typeof (value) === 'string' ? value.trim() : value
  request.yar.set(entryKey, entryValue)
}

const get = (request, entryKey, key) => {
  return key ? request.yar?.get(entryKey)?.[key] : request.yar?.get(entryKey)
}

/**
 * @param request
 * @returns {Address}
 */
const getAddress = (request) => {
  return get(request, keys.entry, keys.address) || {}
}

const setAddress = (request, value) => {
  set(request, keys.entry, keys.address, value)
}

const getOwnerDetails = (request) => {
  return get(request, keys.entry, keys.ownerDetails)
}

const setOwnerDetails = (request, value) => {
  set(request, keys.entry, keys.ownerDetails, value)
}

const getEnforcementDetails = (request) => {
  return get(request, keys.entry, keys.enforcementDetails)
}

const setEnforcementDetails = (request, value) => {
  set(request, keys.entry, keys.enforcementDetails, value)
}

const getPostcodeLookupDetails = (request) => {
  return get(request, keys.entry, keys.postcodeLookup)
}

const setPostcodeLookupDetails = (request, value) => {
  set(request, keys.entry, keys.postcodeLookup, value)
}

module.exports = {
  getOwnerBase: get,
  setOwnerBase: set,
  getAddress,
  setAddress,
  getOwnerDetails,
  setOwnerDetails,
  getEnforcementDetails,
  setEnforcementDetails,
  getPostcodeLookupDetails,
  setPostcodeLookupDetails
}
