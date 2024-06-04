
describe('DDI API dog breeds', () => {
  jest.mock('../../../../app/api/ddi-index-api/base')
  const { get } = require('../../../../app/api/ddi-index-api/base')

  const { getBreeds } = require('../../../../app/api/ddi-index-api/dog-breeds')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('search', () => {
    test('should get search', async () => {
      const expectedResults = {
        breeds: [
          { breed: 'Breed 1' },
          { breed: 'Breed 2' },
          { breed: 'Breed 3' }
        ]
      }

      get.mockResolvedValue(expectedResults)

      const searchResults = await getBreeds()

      expect(get).toHaveBeenCalledWith('dog-breeds', { json: true })
      expect(searchResults).toEqual(expectedResults)
    })
  })
})
