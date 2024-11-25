const { user } = require('../../../mocks/auth')

describe('DDI API search', () => {
  jest.mock('../../../../app/api/ddi-index-api/base')
  const { get } = require('../../../../app/api/ddi-index-api/base')

  const { doSearch, buildExtraParams } = require('../../../../app/api/ddi-index-api/search')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('search', () => {
    test('should get search', async () => {
      const expectedResults = {
        totalFound: 2,
        results: [{ id: 1, microchipNumber: '123456789012345' }, { id: 2 }]
      }

      get.mockResolvedValue({ results: expectedResults })

      const searchResults = await doSearch({
        searchType: 'dog',
        searchTerms: '123456789'
      }, user)

      expect(get).toHaveBeenCalledWith('search/dog/123456789', user)
      expect(searchResults).toEqual(expectedResults)
    })

    test('should get fuzzy search', async () => {
      const expectedResults = {
        results: [{ id: 1, microchipNumber: '123456789012345' }, { id: 2 }],
        totalFound: 2
      }

      get.mockResolvedValue({ results: expectedResults })

      const searchResults = await doSearch({
        searchType: 'dog',
        searchTerms: '123456789',
        fuzzy: true
      }, user)

      expect(get).toHaveBeenCalledWith('search/dog/123456789?fuzzy=true', user)
      expect(searchResults).toEqual(expectedResults)
    })
  })

  describe('buildExtraParams', () => {
    test('should handle zero extra params', () => {
      expect(buildExtraParams({})).toEqual('')
    })

    test('should handle fuzzy match param', () => {
      expect(buildExtraParams({ fuzzy: true })).toEqual('?fuzzy=true')
    })

    test('should handle page param', () => {
      expect(buildExtraParams({ page: 7 })).toEqual('?page=7')
    })

    test('should handle fuzzy and page params together', () => {
      expect(buildExtraParams({ page: 7, fuzzy: true })).toEqual('?fuzzy=true&page=7')
    })
  })
})
