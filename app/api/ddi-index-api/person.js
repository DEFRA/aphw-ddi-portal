const { get, post, put, callDelete } = require('./base')
const schema = require('../../schema/ddi-index-api/people')

const personEndpoint = 'person'
const personAndForceChangeEndpoint = 'person-and-force-change'

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

/**
 * @typedef Address
 * @property {string} addressLine1
 * @property {string} addressLine2
 * @property {string} town
 * @property {string} postcode
 * @property {string} country
 */
/**
 * @typedef LatestContact
 * @property {string} email
 * @property {string} primaryTelephone
 * @property {string} secondaryTelephone
 */
/**
 * @typedef ContactList
 * @property {string[]} emails
 * @property {string[]} primaryTelephones
 * @property {string[]} secondaryTelephones
 */
/**
 * @typedef Contacts
 * @type {LatestContact|ContactList}
 */

/**
 * @typedef Person
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} birthDate
 * @property {string} personReference
 * @property {Address} address
 * @property {Contacts} contacts
 */

/**
 * @param personReference
 * @param user
 * @return {Promise<unknown>}
 */
const getPersonAndDogs = async (personReference, user) => {
  const payload = await get(`${personEndpoint}/${personReference}?includeDogs=true`, user)
  return payload
}

/**
 * @param reference
 * @param user
 * @return {Promise<Person>}
 */
const getPersonByReference = async (reference, user) => {
  const res = await get(`${personEndpoint}/${reference}`, user)

  return res
}

/**
 * @param data
 * @param user
 * @return {Promise<any>}
 */
const updatePerson = async (data, user) => {
  const res = await put(`${personEndpoint}`, data, user)

  return res
}

/**
 * @param data
 * @param user
 * @return {Promise<any>}
 */
const updatePersonAndForce = async (data, user) => {
  const res = await put(`${personAndForceChangeEndpoint}`, data, user)

  return res
}

/**
 * @param reference
 * @param user
 * @return {Promise<unknown>}
 */
const deletePerson = async (reference, user) => {
  const res = await callDelete(`${personEndpoint}/${reference}`, user)

  return res
}

module.exports = {
  addPerson,
  getPersonAndDogs,
  getPersonByReference,
  updatePerson,
  updatePersonAndForce,
  deletePerson
}
