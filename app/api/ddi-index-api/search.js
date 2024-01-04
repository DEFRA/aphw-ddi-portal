const { get } = require('./base')

const searchEndpoint = 'search'

const options = {
  json: true
}

const doSearch = async (criteria) => {
  const payload = await get(`${searchEndpoint}/${criteria.searchType}/${encodeURIComponent(criteria.searchTerms.trim())}`, options)
  return payload.results
}

module.exports = {
  doSearch
}
