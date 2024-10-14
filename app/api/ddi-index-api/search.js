const { get } = require('./base')

const searchEndpoint = 'search'

const doSearch = async (criteria, user) => {
  const fuzzy = criteria.fuzzy ? '?fuzzy=true' : ''
  const { results: { results } } = await get(`${searchEndpoint}/${criteria.searchType}/${encodeURIComponent(criteria.searchTerms.trim())}${fuzzy}`, user)
  return results
}

module.exports = {
  doSearch
}
