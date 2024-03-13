const { get } = require('./base')
const { personsFilter } = require('../../schema/ddi-index-api/persons/get')
const personsEndpoint = 'persons'

const options = {
  json: true
}

/**
 * @typedef GetPersonsFilterOptions
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 */
/**
 * @typedef GetPersonsFilterKeys
 * @type {'firstName'|'lastName'|'dateOfBirth'}
 */
/**
 * @param {{ firstName: string; lastName: string; dateOfBirth?: string; }} filter
 * @returns {Promise<Person[]>}
 */
const getPersons = async (filter) => {
  const validation = personsFilter.validate(filter, { abortEarly: false })
  if (validation.error) {
    throw new Error(validation.error.toString())
  }

  const searchParams = new URLSearchParams(Object.entries(filter))

  const payload = await get(`${personsEndpoint}?${searchParams.toString()}`, options)
  return payload.persons
}

module.exports = {
  getPersons
}