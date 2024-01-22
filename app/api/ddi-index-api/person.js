const { get, post, put } = require('./base')
const schema = require('../../schema/ddi-index-api/people')

const personEndpoint = 'person'

const options = {
  json: true
}

const addPerson = async person => {
  const data = {
    people: [
      person
    ]
  }

  const { error } = schema.validate(data)

  if (error) {
    throw new Error(error)
  }

  const payload = await post(personEndpoint, data)

  return payload.references[0]
}

const getPersonAndDogs = async (personReference) => {
  const payload = await get(`${personEndpoint}/${personReference}?includeDogs=true`, options)
  return payload
}

const getPersonByReference = async (reference) => {
  const res = await get(`${personEndpoint}/${reference}`)

  return res
}

const updatePerson = async (data, user) => {
  const res = await put(`${personEndpoint}`, data, user)

  return res
}

module.exports = {
  addPerson,
  getPersonAndDogs,
  getPersonByReference,
  updatePerson
}
