const { keys } = require('../../constants/search')

const set = (request, entryKey, key, value) => {
  const entryValue = request.yar?.get(entryKey) || {}
  entryValue[key] = typeof (value) === 'string' ? value.trim() : value
  request.yar.set(entryKey, entryValue)
}

const get = (request, entryKey, key) => {
  return key ? request.yar?.get(entryKey)?.[key] : request.yar?.get(entryKey)
}

const getSearchCriteria = (request) => {
  return get(request, keys.entry, keys.searchTerms) || {}
}

const setSearchCriteria = (request, value) => {
  set(request, keys.entry, keys.searchTerms, value)
}

const getSearchResults = (request) => {
  return get(request, keys.entry, keys.searchResults) || {}
}

const setSearchResults = (request, value) => {
  set(request, keys.entry, keys.searchResults, value)
}

module.exports = {
  getSearchCriteria,
  setSearchCriteria,
  getSearchResults,
  setSearchResults
}
