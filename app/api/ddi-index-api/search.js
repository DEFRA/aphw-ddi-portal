const { get } = require('./base')

const searchEndpoint = 'search'

const options = {
  json: true
}

const doSearch = async (criteria) => {
  const strippedTerms = criteria?.searchTerms?.replace(/[`~!@#$%^&*_|=?;:'",.<>{}[\]]/gi, '')
  const payload = await get(`${searchEndpoint}/${criteria.searchType}/${encodeURIComponent(strippedTerms)}`, options)
  return payload.results
}

module.exports = {
  doSearch
}
