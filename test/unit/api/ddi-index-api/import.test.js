const { user } = require('../../../mocks/auth')

describe('Import API endpoints', () => {
  jest.mock('../../../../app/api/ddi-index-api/base')
  const { post } = require('../../../../app/api/ddi-index-api/base')

  const { doImport } = require('../../../../app/api/ddi-index-api/import')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('import should call POST to API', async () => {
    post.mockResolvedValue({ payload: { exported: {} } })

    await doImport('filename1.xlsx', 'import-validation', user)

    expect(post).toHaveBeenCalledWith('robot-import', { filename: 'filename1.xlsx', stage: 'import-validation' }, user)
  })
})
