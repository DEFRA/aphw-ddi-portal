const { user } = require('../../../mocks/auth')

describe('DDI API search', () => {
  jest.mock('../../../../app/api/ddi-index-api/base')
  const { get } = require('../../../../app/api/ddi-index-api/base')

  const { doSearch } = require('../../../../app/api/ddi-index-api/search')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('search', () => {
    test('should get search', async () => {
      const expectedResults = ([{ id: 1, microchipNumber: '123456789012345' }, { id: 2 }])

      get.mockResolvedValue({
        results: expectedResults
      })

      const searchResults = await doSearch({
        searchType: 'dog',
        searchTerms: '123456789'
      }, user)

      expect(get).toHaveBeenCalledWith('search/dog/123456789', user)
      expect(searchResults).toEqual(expectedResults)
    })

    test('should get fuzzy search', async () => {
      const expectedResults = ([{ id: 1, microchipNumber: '123456789012345' }, { id: 2 }])

      get.mockResolvedValue({
        results: expectedResults
      })

      const searchResults = await doSearch({
        searchType: 'dog',
        searchTerms: '123456789',
        fuzzy: true
      }, user)

      expect(get).toHaveBeenCalledWith('search/dog/123456789?fuzzy=true', user)
      expect(searchResults).toEqual(expectedResults)
    })
  })
})
