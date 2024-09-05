const constructFuzzySearchUrl = origUrl => {
  if (!origUrl) {
    return '/'
  }
  if (origUrl.endsWith('&fuzzy=N')) {
    return origUrl.replace('&fuzzy=N', '&fuzzy=Y')
  }
  if (origUrl.endsWith('&fuzzy=Y')) {
    return origUrl
  }
  return `${origUrl}&fuzzy=Y`
}

module.exports = {
  constructFuzzySearchUrl
}
