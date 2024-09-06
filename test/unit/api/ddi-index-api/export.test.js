const { user } = require('../../../mocks/auth')

describe('Export API endpoints', () => {
  jest.mock('../../../../app/api/ddi-index-api/base')
  const { get } = require('../../../../app/api/ddi-index-api/base')

  const { exportAudit, createExportFile } = require('../../../../app/api/ddi-index-api/export')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('export-audit should call GET to API', async () => {
    get.mockResolvedValue({ payload: { exported: {} } })

    await exportAudit(user)

    expect(get).toHaveBeenCalledWith('export-audit', user)
  })

  test('export-create-file should call GET to API', async () => {
    get.mockResolvedValue()

    await createExportFile(100, user)

    expect(get).toHaveBeenCalledWith('export-create-file?batchSize=100', user)
  })
})
