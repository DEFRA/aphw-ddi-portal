const { getRegularJobs } = require('../../../../app/api/ddi-index-api/regular-jobs')
const { get } = require('../../../../app/api/ddi-index-api/base')
const { user } = require('../../../mocks/auth')
jest.mock('../../../../app/api/ddi-index-api/base')

describe('Regular Jobs test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('getRegularJobs calls endpoint', async () => {
    get.mockResolvedValue({ payload: {} })
    await getRegularJobs(user)
    expect(get).toHaveBeenCalledWith('regular-jobs', user)
  })
})
