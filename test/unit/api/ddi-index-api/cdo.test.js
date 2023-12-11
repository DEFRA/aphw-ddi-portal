describe('CDO API endpoints', () => {
  jest.mock('../../../../app/api/ddi-index-api/base')
  const { post } = require('../../../../app/api/ddi-index-api/base')

  const { cdo } = require('../../../../app/api/ddi-index-api')

  const { valid, invalid } = require('../../../mocks/cdo/createPayload')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('createCdo with valid payload should post to API', async () => {
    await cdo.createCdo(valid)

    expect(post).toHaveBeenCalledTimes(1)
  })

  test('createCdo with invalid payload should not post to API', async () => {
    await expect(cdo.createCdo(invalid)).rejects.toThrow()
    expect(post).not.toHaveBeenCalled()
  })
})
