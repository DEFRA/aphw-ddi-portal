const { get, post } = require('./base')

const dogsEndpoint = 'dogs'
const bulkDeleteDogsEndpoint = 'dogs:batch-delete'

const options = {
  json: true
}

const getOldDogs = async (sort, stepNum) => {
  const payload = await get(`${dogsEndpoint}?forPurging=true&stepNum=${stepNum ?? 1}&sortKey=${sort?.column ?? 'status'}&sortOrder=${sort?.order ?? 'ASC'}`, options)
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
