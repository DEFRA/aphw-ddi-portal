const { keys } = require('../../constants/cdo/activity')

const set = (request, entryKey, key, value) => {
  const entryValue = request.yar?.get(entryKey) || {}
  entryValue[key] = typeof (value) === 'string' ? value.trim() : value
  request.yar.set(entryKey, entryValue)
}

const get = (request, entryKey, key) => {
  return key ? request.yar?.get(entryKey)?.[key] : request.yar?.get(entryKey)
}

const getActivityDetails = (request) => {
  return get(request, keys.entry, keys.activityDetails)
}

const setActivityDetails = (request, value) => {
  set(request, keys.entry, keys.activityDetails, value)
}

module.exports = {
  setActivityDetails,
  getActivityDetails
}
