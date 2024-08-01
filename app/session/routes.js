const { keys } = require('../constants/forms')

const getRouteFlags = request => {
  return request.yar?.get(keys.routingFlags) || {}
}

const isRouteFlagSet = (request, flagName) => {
  return getRouteFlags(request)[flagName] === true
}

const setRouteFlag = (request, flagName) => {
  const flags = { ...getRouteFlags(request) }
  flags[flagName] = true
  request.yar.set(keys.routingFlags, flags)
}

const clearRouteFlag = (request, flagName) => {
  const flags = { ...getRouteFlags(request) }
  if (flags[flagName]) {
    delete flags[flagName]
  }
  request.yar.set(keys.routingFlags, flags)
}

const clearAllRouteFlags = request => {
  request.yar.set(keys.routingFlags, null)
}

module.exports = {
  isRouteFlagSet,
  setRouteFlag,
  clearRouteFlag,
  clearAllRouteFlags
}
