const { get } = require('./base')

const searchEndpoint = 'search'

const options = {
  json: true
}

const doSearch = async (criteria) => {
  const fuzzy = criteria.fuzzy ? '?fuzzy=true' : ''
  const payload = await get(`${searchEndpoint}/${criteria.searchType}/${encodeURIComponent(criteria.searchTerms.trim())}${fuzzy}`, options)
  return payload.results
}

module.exports = {
  doSearch
}
