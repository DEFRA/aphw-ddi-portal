const { user } = require('../../../mocks/auth')
describe('CDO API endpoints', () => {
  jest.mock('../../../../app/api/ddi-index-api/base')
  const { put } = require('../../../../app/api/ddi-index-api/base')

  const { exemption } = require('../../../../app/api/ddi-index-api')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('updateExemption should PUT to API', async () => {
    await exemption.updateExemption({}, user)

    expect(put).toHaveBeenCalledTimes(1)
  })
})
