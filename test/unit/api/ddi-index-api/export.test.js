const { user } = require('../../../mocks/auth')

describe('Export API endpoints', () => {
  jest.mock('../../../../app/api/ddi-index-api/base')
  const { get } = require('../../../../app/api/ddi-index-api/base')

  const { exportData, triggerOvernight } = require('../../../../app/api/ddi-index-api/export')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('export should call GET to API', async () => {
    get.mockResolvedValue({ payload: { exported: {} } })

    await exportData(user)

    expect(get).toHaveBeenCalledWith('export', user)
  })

  test('triggerOvernight should call GET to API', async () => {
    get.mockResolvedValue({ payload: { exported: {} } })

    await triggerOvernight(user)

    expect(get).toHaveBeenCalledWith('trigger-overnight', user)
  })
})
