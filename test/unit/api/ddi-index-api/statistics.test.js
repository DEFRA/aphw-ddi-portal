const { getStatistics } = require('../../../../app/api/ddi-index-api/statistics')
const { get } = require('../../../../app/api/ddi-index-api/base')
jest.mock('../../../../app/api/ddi-index-api/base')

describe('Statistics api test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('getStatistics calls endpoint', async () => {
    get.mockResolvedValue({ payload: {} })
    await getStatistics('testQuery')
    expect(get).toHaveBeenCalledWith('statistics?queryName=testQuery', expect.anything())
  })
})
