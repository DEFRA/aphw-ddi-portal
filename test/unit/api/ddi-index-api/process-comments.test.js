const { getProcessComments } = require('../../../../app/api/ddi-index-api/process-comments')
const { get } = require('../../../../app/api/ddi-index-api/base')
jest.mock('../../../../app/api/ddi-index-api/base')

describe('Regular Jobs test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('getRegularJobs calls endpoint', async () => {
    get.mockResolvedValue({ payload: {} })
    await getProcessComments()
    expect(get).toHaveBeenCalledWith('process-comments?maxRecords=50', expect.anything())
  })

  test('getRegularJobs calls endpoint with limit', async () => {
    get.mockResolvedValue({ payload: {} })
    await getProcessComments(1)
    expect(get).toHaveBeenCalledWith('process-comments?maxRecords=1', expect.anything())
  })
})
