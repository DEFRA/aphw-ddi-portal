const { get } = require('./base')

const dogsEndpoint = 'dogs'

const options = {
  json: true
}

const getOldDogs = async (sort) => {
  const payload = await get(`${dogsEndpoint}?forPurging=true&sortKey=${sort?.column ?? 'status'}&sortOrder=${sort?.order ?? 'ASC'}`, options)
  return payload
}

module.exports = {
  getOldDogs
}
