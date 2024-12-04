const { set } = require('../../../../app/session/cdo')

describe('cdo index', () => {
  const mockRequest = {
    yar: {
      get: jest.fn(),
      set: jest.fn()
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('set', () => {
    test('should set when get is empty', () => {
      set(mockRequest, 'entryKey', 'key', 1)
      expect(mockRequest.yar.set).toHaveBeenCalledWith('entryKey', { key: 1 })
    })

    test('should set when get is empty', () => {
      mockRequest.yar.get.mockReturnValue({ key: 1 })
      set(mockRequest, 'entryKey', 'key', '1')
      expect(mockRequest.yar.set).toHaveBeenCalledWith('entryKey', { key: '1' })
    })
  })
})
