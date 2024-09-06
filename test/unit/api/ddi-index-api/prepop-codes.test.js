describe('PrepopCodes API endpoints', () => {
  jest.mock('../../../../app/api/ddi-index-api/base')
  const { get } = require('../../../../app/api/ddi-index-api/base')

  const { prepopCodes } = require('../../../../app/api/ddi-index-api/prepop-codes')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('prepop-codes should call GET to API', async () => {
    get.mockResolvedValue()

    await prepopCodes()

    expect(get).toHaveBeenCalledWith('prepop-codes')
  })
})
