const { getActivityBase, setActivityBase } = require('../../../../app/session/cdo/activity')

describe('cdo activity session helpers', () => {
  const mockRequest = {
    yar: {
      get: jest.fn(),
      set: jest.fn()
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('getActivityBase', () => {
    mockRequest.yar.get.mockReturnValue({
      pk: 'ED12345',
      source: 'dog',
      activityType: 'sent'
    })

    const activity = getActivityBase(mockRequest, 'activity')
    expect(activity).toEqual({
      pk: 'ED12345',
      source: 'dog',
      activityType: 'sent'
    })
  })

  test('setActivityBase sets cdo in session', () => {
    mockRequest.yar.get.mockReturnValue({
      pk: 'ED300010',
      source: 'owner',
      activityType: 'sent'
    })

    setActivityBase(mockRequest, 'activityDetails', 'source', ' dog ')

    expect(mockRequest.yar.set).toHaveBeenCalledTimes(1)
    expect(mockRequest.yar.set).toHaveBeenCalledWith('activityDetails', {
      pk: 'ED300010',
      source: 'dog',
      activityType: 'sent'
    })
  })
})
