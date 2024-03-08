const { get } = require('./base')

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
  const urlParams = []
  /**
   * @type {GetPersonsFilterKeys[]}
   */
  const requiredParams = ['firstName', 'lastName']
  /**
   * @type {GetPersonsFilterKeys[]}
   */
  const optionalParams = ['dateOfBirth']
  const allParams = [...requiredParams, ...optionalParams]
  Object.keys(filter).forEach(filterKey => {
    if (!allParams.includes(filterKey)) {
      throw Error(`Filter parameter - ${filterKey} not permitted`)
    }
  })

  allParams.forEach(param => {
    if (filter[param]) {
      urlParams.push([param, filter[param]])
    } else if (requiredParams.includes(param)) {
      throw Error(`Filter parameter - ${param} is required`)
    }
  })

  const searchParams = new URLSearchParams(urlParams)

  const payload = await get(`${personsEndpoint}?${searchParams.toString()}`, options)
  return payload
}

module.exports = {
  getPersons
}
