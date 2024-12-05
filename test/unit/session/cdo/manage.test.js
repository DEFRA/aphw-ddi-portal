const { getVerificationPayload, setVerificationPayload, clearVerificationPayload } = require('../../../../app/session/cdo/manage')
const { buildVerificationPayload } = require('../../../mocks/cdo/manage/tasks/builder')

describe('cdo session helpers', () => {
  const mockRequest = {
    yar: {
      get: jest.fn(),
      set: jest.fn()
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('getVerificationPayload', () => {
    const dummyPayload = buildVerificationPayload()
    mockRequest.yar.get.mockReturnValue(dummyPayload)

    const verificationPayload = getVerificationPayload(mockRequest)
    expect(mockRequest.yar.get).toHaveBeenCalledWith('verificationPayload')
    expect(verificationPayload).toEqual(dummyPayload)
  })

  test('getVerificationPayload with no yar in session', () => {
    const verificationPayload = getVerificationPayload({})

    expect(verificationPayload).toBeUndefined()
  })

  test('setVerificationPayload sets verification payload in session', () => {
    mockRequest.yar.get.mockReturnValue(undefined)

    const verificationPayloadMock = buildVerificationPayload()

    setVerificationPayload(mockRequest, verificationPayloadMock)

    expect(mockRequest.yar.set).toHaveBeenCalledTimes(1)
    expect(mockRequest.yar.set).toHaveBeenCalledWith('verificationPayload', verificationPayloadMock)
  })

  test('setVerificationPayload sets verification payload in session', () => {
    const verificationPayloadMock = buildVerificationPayload()
    mockRequest.yar.get.mockReturnValue(verificationPayloadMock)

    clearVerificationPayload(mockRequest, verificationPayloadMock)

    expect(mockRequest.yar.set).toHaveBeenCalledTimes(1)
    expect(mockRequest.yar.set).toHaveBeenCalledWith('verificationPayload', {})
  })
})
