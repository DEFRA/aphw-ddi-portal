const { get } = require('./base')

const searchEndpoint = 'search'

const buildExtraParams = (criteria) => {
  const extraParamList = []
  if (criteria.fuzzy) {
    extraParamList.push('fuzzy=true')
  }
  if (criteria.page) {
    extraParamList.push(`page=${criteria.page}`)
  }
  return extraParamList.length === 0 ? '' : `?${extraParamList.join('&')}`
}

/**
 * @typedef DogFromSearch
 * @property {number} dogId
 * @property {string} dogIndex
 * @property {string} dogName
 * @property {string} microchipNumber
 * @property {string} microchipNumber2
 * @property {string} dogStatus
 */

/**
 * @typedef SearchResults
 * @property {string} searchType
 * @property {string} email
 * @property {string} address
 * @property {string} dogIndex
 * @property {string} dogName
 * @property {string} dogStatus
 * @property {string} personReference
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} microchipNumber
 * @property {string} microchipNumber2
 * @property {string} organisationName
 * @property {number} dogId
 * @property {number} personId
 * @property {number} distance
 * @property {number} rank
 * @property {DogFromSearch[]} dogs

 */
/**
 * @typedef SearchObject
 * @property {number} totalFound
 * @property {SearchResults[]} results
 */
/**
 * @param criteria
 * @param user
 * @return {Promise<SearchObject>}
 */
const doSearch = async (criteria, user) => {
  const extraParams = buildExtraParams(criteria)
  /**
   * @type {{ results: SearchObject }}
   */
  const payload = await get(`${searchEndpoint}/${criteria.searchType}/${encodeURIComponent(criteria.searchTerms.trim())}${extraParams}`, user)
  return payload.results
}

module.exports = {
  doSearch,
  buildExtraParams
}
