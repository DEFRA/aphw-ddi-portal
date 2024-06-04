
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
      })

      expect(get).toHaveBeenCalledWith('search/dog/123456789', { json: true })
      expect(searchResults).toEqual(expectedResults)
    })
  })
})
