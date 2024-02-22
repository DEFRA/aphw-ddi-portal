const { getRegularJobs } = require('../../../../app/api/ddi-index-api/regular-jobs')
const { get } = require('../../../../app/api/ddi-index-api/base')
jest.mock('../../../../app/api/ddi-index-api/base')

describe('Regular Jobs test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('getRegularJobs calls endpoint', async () => {
    get.mockResolvedValue({ payload: {} })
    await getRegularJobs()
    expect(get).toHaveBeenCalledWith('regular-jobs')
  })
})
