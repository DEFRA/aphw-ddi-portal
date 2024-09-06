const { constructFuzzySearchUrl } = require('../../../app/lib/search-helpers')

describe('constructFuzzySearchUrl', () => {
  test('handles null or undefined', () => {
    expect(constructFuzzySearchUrl(null)).toBe('/')
    expect(constructFuzzySearchUrl(undefined)).toBe('/')
  })

  test('leaves fuzzy=Y untouched', () => {
    const url = 'http://testhost.com/cdo/search/basic?searchTerms=john+smith&searchType=owner&fuzzy=Y'
    expect(constructFuzzySearchUrl(url)).toBe(url)
  })

  test('changes fuzzy=N to fuzzy=Y', () => {
    const url = 'http://testhost.com/cdo/search/basic?searchTerms=john+smith&searchType=owner&fuzzy=N'
    const expectedUrl = 'http://testhost.com/cdo/search/basic?searchTerms=john+smith&searchType=owner&fuzzy=Y'
    expect(constructFuzzySearchUrl(url)).toBe(expectedUrl)
  })

  test('adds fuzzy=Y', () => {
    const url = 'http://testhost.com/cdo/search/basic?searchTerms=john+smith&searchType=owner'
    const expectedUrl = 'http://testhost.com/cdo/search/basic?searchTerms=john+smith&searchType=owner&fuzzy=Y'
    expect(constructFuzzySearchUrl(url)).toBe(expectedUrl)
  })
})
