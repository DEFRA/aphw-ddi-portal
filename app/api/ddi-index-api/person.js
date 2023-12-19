const { get, put } = require('./base')

const personEndpoint = "person"

const getPersonByReference = async (reference) => {
  const res = await get(`${personEndpoint}/${reference}`)

  return res
}

const updatePerson = async (data) => {
  const res = await put(`${personEndpoint}`, data)

  return res
}

module.exports = {
  getPersonByReference,
  updatePerson
}
