describe('CDO API endpoints', () => {
  jest.mock('../../../../app/api/ddi-index-api/base')
  const { get, post, boomRequest } = require('../../../../app/api/ddi-index-api/base')

  const { user } = require('../../../mocks/auth')

  const { cdo } = require('../../../../app/api/ddi-index-api')

  const { valid, invalid, validWithCountry, validWithCountryAndPersonReference } = require('../../../mocks/cdo/createPayload')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getCdo', () => {
    test('getCdo should do GET to API', async () => {
      get.mockResolvedValue({ cdo: {} })
      await cdo.getCdo('ED123', user)

      expect(get).toHaveBeenCalledTimes(1)
    })
  })

  describe('createCdo', () => {
    test('createCdo with valid payload should post to API', async () => {
      await cdo.createCdo(valid, user)

      expect(post).toHaveBeenCalledTimes(1)
    })

    test('createCdo with valid payload including country should post to API', async () => {
      await cdo.createCdo(validWithCountry, user)

      expect(post).toHaveBeenCalledTimes(1)
    })

    test('createCdo with valid payload including person reference should post to API', async () => {
      await cdo.createCdo(validWithCountryAndPersonReference, user)

      expect(post).toHaveBeenCalledTimes(1)
    })

    test('createCdo with invalid payload should not post to API', async () => {
      await expect(cdo.createCdo(invalid, user)).rejects.toThrow()
      expect(post).not.toHaveBeenCalled()
    })
  })

  describe('getManageCdoDetails', () => {
    test('should do GET to API with correct endpoint', async () => {
      get.mockResolvedValue({ tasks: {} })
      const res = await cdo.getManageCdoDetails('ED123', user)

      expect(get).toHaveBeenCalledWith('cdo/ED123/manage', user)
      expect(res).toEqual({ tasks: {} })
    })
  })

  describe('getCdoTaskDetails', () => {
    test('should do GET to API with correct endpoint', async () => {
      get.mockResolvedValue({ tasks: {} })
      const res = await cdo.getCdoTaskDetails('ED123', user)

      expect(get).toHaveBeenCalledWith('cdo/ED123/manage', user)
      expect(res).toEqual({ tasks: {} })
    })
  })

  describe('saveCdoTaskDetails', () => {
    test('should do POST to API with correct endpoint and payload', async () => {
      await cdo.saveCdoTaskDetails('ED123', 'send-application-pack', { payload: 'abc' }, user)

      expect(boomRequest).toHaveBeenCalledWith('cdo/ED123/manage:send-application-pack', 'POST', { payload: 'abc' }, user)
    })
  })
})
