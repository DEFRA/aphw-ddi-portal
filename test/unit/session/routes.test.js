const {
  isRouteFlagSet,
  setRouteFlag,
  clearRouteFlag,
  clearAllRouteFlags
} = require('../../../app/session/routes')

describe('route session storage', () => {
  const mockRequest = {
    yar: {
      get: jest.fn(),
      set: jest.fn()
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('isRouteFlagSet returns true if flag is set', () => {
    mockRequest.yar.get.mockReturnValue({
      flag1: true,
      flag2: true
    })

    const res = isRouteFlagSet(mockRequest, 'flag2')

    expect(mockRequest.yar.get).toHaveBeenCalledTimes(1)
    expect(mockRequest.yar.get).toHaveBeenCalledWith('routingFlags')
    expect(res).toBeTruthy()
  })

  test('isRouteFlagSet returns true if flag is not set and empty session', () => {
    mockRequest.yar.get.mockReturnValue()

    const res = isRouteFlagSet(mockRequest, 'flag2')

    expect(mockRequest.yar.get).toHaveBeenCalledTimes(1)
    expect(mockRequest.yar.get).toHaveBeenCalledWith('routingFlags')
    expect(res).toBeFalsy()
  })

  test('isRouteFlagSet returns true if flag is not set', () => {
    mockRequest.yar.get.mockReturnValue({ flag1: true })

    const res = isRouteFlagSet(mockRequest, 'flag2')

    expect(mockRequest.yar.get).toHaveBeenCalledTimes(1)
    expect(mockRequest.yar.get).toHaveBeenCalledWith('routingFlags')
    expect(res).toBeFalsy()
  })

  test('setRouteFlag sets route flag, adding to empty session object', () => {
    mockRequest.yar.get.mockReturnValue()

    setRouteFlag(mockRequest, 'testRouteFlag1')

    expect(mockRequest.yar.get).toHaveBeenCalledTimes(1)
    expect(mockRequest.yar.set).toHaveBeenCalledWith('routingFlags', { testRouteFlag1: true })
  })

  test('setRouteFlag sets route flag, adding to existing session object', () => {
    mockRequest.yar.get.mockReturnValue({
      flag1: true,
      flag3: true
    })

    setRouteFlag(mockRequest, 'flag2')

    expect(mockRequest.yar.get).toHaveBeenCalledTimes(1)
    expect(mockRequest.yar.set).toHaveBeenCalledWith('routingFlags', {
      flag1: true,
      flag2: true,
      flag3: true
    })
  })

  test('clearRouteFlag clears route flag if exists', () => {
    mockRequest.yar.get.mockReturnValue({
      flag1: true,
      flag2: true
    })

    clearRouteFlag(mockRequest, 'flag1')

    expect(mockRequest.yar.get).toHaveBeenCalledTimes(1)
    expect(mockRequest.yar.set).toHaveBeenCalledWith('routingFlags', { flag2: true })
  })

  test('clearRouteFlag clears route flag handles ok if not exists', () => {
    mockRequest.yar.get.mockReturnValue({
      flag1: true,
      flag2: true
    })

    clearRouteFlag(mockRequest, 'flag3')

    expect(mockRequest.yar.get).toHaveBeenCalledTimes(1)
    expect(mockRequest.yar.set).toHaveBeenCalledWith('routingFlags', { flag1: true, flag2: true })
  })

  test('clearAllRouteFlags clears all flags', () => {
    clearAllRouteFlags(mockRequest)

    expect(mockRequest.yar.set).toHaveBeenCalledWith('routingFlags', null)
  })
})
