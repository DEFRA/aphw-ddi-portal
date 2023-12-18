const { get } = require('./base')

const personEndpoint = "person"

const getPersonByReference = async (reference) => {
  const res = await get(`${personEndpoint}/${reference}`)

  return res
}

module.exports = {
  getPersonByReference
}
