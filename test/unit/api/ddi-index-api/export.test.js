const { user } = require('../../../mocks/auth')

describe('Export API endpoints', () => {
  jest.mock('../../../../app/api/ddi-index-api/base')
  const { get } = require('../../../../app/api/ddi-index-api/base')

  const { exportData, createExportFile } = require('../../../../app/api/ddi-index-api/export')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('export should call GET to API', async () => {
    get.mockResolvedValue({ payload: { exported: {} } })

    await exportData(user)

    expect(get).toHaveBeenCalledWith('export', user)
  })

  test('export-create-file should call GET to API', async () => {
    get.mockResolvedValue()

    await createExportFile(100)

    expect(get).toHaveBeenCalledWith('export-create-file?batchSize=100')
  })
})
