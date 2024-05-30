const { getOldDogs } = require('../../../../app/api/ddi-index-api/dogs')
jest.mock('../../../../app/api/ddi-index-api/base')
const { get } = require('../../../../app/api/ddi-index-api/base')

describe('Dogs test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('getOldDogs calls endpoint with valid params when no sort passed', async () => {
    get.mockResolvedValue()
    await getOldDogs()
    expect(get).toHaveBeenCalledWith('dogs?forPurging=true&sortKey=status&sortOrder=ASC', { json: true })
  })
})
