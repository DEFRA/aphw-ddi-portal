const constants = {
  routes: {
    searchBasic: {
      get: '/cdo/search/basic'
    }
  },
  views: {
    searchBasic: 'cdo/search/basic'
  },
  keys: {
    entry: 'basicSearch',
    searchTerms: 'searchTerms',
    searchResults: 'searchResults'
  },
  pagination: {
    resultsPerPage: 20
  }
}

module.exports = constants
