const { get, post } = require('./base')
const { personsFilter } = require('../../schema/ddi-index-api/persons/get')

const personsEndpoint = 'persons'
const bulkDeletePersonsEndpoint = 'persons:batch-delete'

/**
 * @typedef GetPersonsFilterOptions
 * @property {string} [firstName]
 * @property {string} [lastName]
 * @property {string} [dateOfBirth]
 * @property {boolean} [orphaned]
 * @property {number} [limit]
 * @property {'owner'} [sortKey]
 */
/**
 * @typedef GetPersonsFilterKeys
 * @type {'firstName'|'lastName'|'dateOfBirth'|'orphaned'}
 */
/**
 * @param {GetPersonsFilterOptions} filter
 * @returns {Promise<import('./person.js').Person[]>}
 */
const getPersons = async (filter, user) => {
  const { value, error } = personsFilter.validate(filter, { abortEarly: false, dateFormat: 'utc', stripUnknown: true })

  if (error) {
    throw new Error(error.toString())
  }

  const searchParams = new URLSearchParams(Object.entries(value))

  const payload = await get(`${personsEndpoint}?${searchParams.toString()}`, user)

  return payload.persons
}

const getOrphanedOwners = async (user, filter = {}) => {
  return getPersons({
    limit: -1,
    sortKey: 'owner',
    sortOrder: 'ASC',
    ...filter,
    orphaned: true
  }, user)
}

const bulkDeletePersons = async (personReferences, user) => {
  return post(bulkDeletePersonsEndpoint, { personReferences }, user)
}

module.exports = {
  getPersons,
  getOrphanedOwners,
  bulkDeletePersons
}
