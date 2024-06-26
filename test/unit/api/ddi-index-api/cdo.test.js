describe('CDO API endpoints', () => {
  jest.mock('../../../../app/api/ddi-index-api/base')
  const { get, post } = require('../../../../app/api/ddi-index-api/base')

  const { user } = require('../../../mocks/auth')

  const { cdo } = require('../../../../app/api/ddi-index-api')

  const { valid, invalid, validWithCountry, validWithCountryAndPersonReference } = require('../../../mocks/cdo/createPayload')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getCdo', () => {
    test('getCdo should do GET to API', async () => {
      get.mockResolvedValue({ cdo: {} })
      await cdo.getCdo('ED123')

      expect(get).toHaveBeenCalledTimes(1)
    })
  })

  describe('createCdo', () => {
    test('createCdo with valid payload should post to API', async () => {
      await cdo.createCdo(valid)

      expect(post).toHaveBeenCalledTimes(1)
    })

    test('createCdo with valid payload including country should post to API', async () => {
      await cdo.createCdo(validWithCountry)

      expect(post).toHaveBeenCalledTimes(1)
    })

    test('createCdo with valid payload including person reference should post to API', async () => {
      await cdo.createCdo(validWithCountryAndPersonReference)

      expect(post).toHaveBeenCalledTimes(1)
    })

    test('createCdo with invalid payload should not post to API', async () => {
      await expect(cdo.createCdo(invalid)).rejects.toThrow()
      expect(post).not.toHaveBeenCalled()
    })
  })

  describe('getManageCdoDetails', () => {
    test('should do GET to API with correct endpoint', async () => {
      get.mockResolvedValue({ tasks: {} })
      const res = await cdo.getManageCdoDetails('ED123')

      expect(get).toHaveBeenCalledWith('cdo/ED123/manage', { json: true })
      expect(res).toEqual({ tasks: {} })
    })
  })

  describe('getCdoTaskDetails', () => {
    test('should do GET to API with correct endpoint', async () => {
      get.mockResolvedValue({ task: {} })
      const res = await cdo.getCdoTaskDetails('ED123', 'send-application-pack456')

      expect(get).toHaveBeenCalledWith('cdo/ED123/manage:send-application-pack456', { json: true })
      expect(res).toEqual({ task: {} })
    })
  })

  describe('saveCdoTaskDetails', () => {
    test('should do POST to API with correct endpoint and payload', async () => {
      await cdo.saveCdoTaskDetails('ED123', 'send-application-pack456', { payload: 'abc' }, user)

      expect(post).toHaveBeenCalledWith('cdo/ED123/manage:send-application-pack456', { payload: 'abc' }, user)
    })
  })
})
