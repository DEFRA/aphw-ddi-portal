const { keys } = require('../../constants/cdo/owner')

const set = (request, entryKey, key, value) => {
  const entryValue = request.yar?.get(entryKey) || {}
  entryValue[key] = typeof (value) === 'string' ? value.trim() : value
  request.yar.set(entryKey, entryValue)
}

const get = (request, entryKey, key) => {
  return key ? request.yar?.get(entryKey)?.[key] : request.yar?.get(entryKey)
}

const getOwner = (request) => {
  return get(request, keys.entry) || {}
}

const setOwner = (request, value) => {
  set(request, keys.entry, value)
}

const getName = (request) => {
  return get(request, keys.entry, keys.name) || {}
}

const setName = (request, value) => {
  set(request, keys.entry, keys.name, value)
}

const getBirthDate = (request) => {
  return get(request, keys.entry, keys.dateOfBirth) || {}
}

const setBirthDate = (request, value) => {
  set(request, keys.entry, keys.dateOfBirth, value)
}

const getAddress = (request) => {
  return get(request, keys.entry, keys.address) || {}
}

const setAddress = (request, value) => {
  set(request, keys.entry, keys.address, value)
}

const getEmail = (request) => {
  return get(request, keys.entry, keys.email)
}

const setEmail = (request, value) => {
  set(request, keys.entry, keys.email, value)
}

const getAddressPostcode = (request) => {
  return get(request, keys.entry, keys.address)?.postcode
}

const setAddressPostcode = (request, value) => {
  set(request, keys.entry, keys.address, value)
}

const getPhoneNumber = (request) => {
  return get(request, keys.entry, keys.phoneNumber)
}

const setPhoneNumber = (request, value) => {
  set(request, keys.entry, keys.phoneNumber, value)
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

module.exports = {
  getOwner,
  setOwner,
  getName,
  setName,
  getBirthDate,
  setBirthDate,
  getAddress,
  setAddress,
  getAddressPostcode,
  setAddressPostcode,
  getEmail,
  setEmail,
  getPhoneNumber,
  setPhoneNumber,
  getOwnerDetails,
  setOwnerDetails,
  getEnforcementDetails,
  setEnforcementDetails
}
