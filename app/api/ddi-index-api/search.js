const { get } = require('./base')

const searchEndpoint = 'search'

const doSearch = async (criteria, user) => {
  const payload = await get(`${searchEndpoint}/${criteria.searchType}/${encodeURIComponent(criteria.searchTerms.trim())}`, user)
  return payload.results
}

module.exports = {
  doSearch
}
