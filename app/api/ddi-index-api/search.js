const { get } = require('./base')

const searchEndpoint = 'search'

const doSearch = async (criteria, user) => {
  const fuzzy = criteria.fuzzy ? '?fuzzy=true' : ''
  const payload = await get(`${searchEndpoint}/${criteria.searchType}/${encodeURIComponent(criteria.searchTerms.trim())}${fuzzy}`, user)
  return payload.results
}

module.exports = {
  doSearch
}
