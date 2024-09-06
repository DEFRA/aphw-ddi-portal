const { get, post } = require('./base')

const dogsEndpoint = 'dogs'
const bulkDeleteDogsEndpoint = 'dogs:batch-delete'

const getOldDogs = async (user, statuses, sort, overrideToday) => {
  const dateOverride = overrideToday ? `&today=${overrideToday}` : ''
  const payload = await get(`${dogsEndpoint}?forPurging=true&statuses=${statuses}&sortKey=${sort?.column ?? 'status'}&sortOrder=${sort?.order ?? 'ASC'}${dateOverride}`, user)
  return payload
}

const bulkDeleteDogs = async (pks, user) => {
  const payload = await post(bulkDeleteDogsEndpoint, { dogPks: pks }, user)
  return payload
}

module.exports = {
  getOldDogs,
  bulkDeleteDogs
}
