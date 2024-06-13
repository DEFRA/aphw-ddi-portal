const { initialiseDogsForDeletion, getDogsForDeletion, setDogsForDeletion } = require('../../../../app/session/admin/delete-dogs')

describe('delete-dog', () => {
  const mockRequest = {
    yar: {
      get: jest.fn(),
      set: jest.fn(),
      clear: jest.fn()
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getDogsForDeletion', () => {
    test('given they exist', () => {
      const dogIndexNumbers = ['ED12345']

      mockRequest.yar.get.mockReturnValue(dogIndexNumbers)

      const dogs = getDogsForDeletion(mockRequest, 1)
      expect(dogs).toEqual(dogIndexNumbers)
      expect(mockRequest.yar.get).toHaveBeenCalledWith('oldDogs1')
      expect(mockRequest.yar.set).not.toHaveBeenCalled()
    })

    test('given none exist', () => {
      mockRequest.yar.get.mockReturnValue(undefined)

      const dogs = getDogsForDeletion(mockRequest, 1)
      expect(dogs).toEqual([])
    })
  })

  describe('setDogsForDeletion', () => {
    test('should set single dog', () => {
      const dogIndexNumber = 'ED12345'

      setDogsForDeletion(mockRequest, 2, dogIndexNumber)
      expect(mockRequest.yar.set).toHaveBeenCalledWith('oldDogs2', [dogIndexNumber])
    })

    test('should set multiple owners', () => {
      const dogIndexNumbers = ['ED12345', 'ED23456']

      setDogsForDeletion(mockRequest, 1, dogIndexNumbers)
      expect(mockRequest.yar.set).toHaveBeenCalledWith('oldDogs1', dogIndexNumbers)
    })

    test('should set empty array if empty', () => {
      setDogsForDeletion(mockRequest, 1, undefined)
      expect(mockRequest.yar.set).toHaveBeenCalledWith('oldDogs1', [])
    })
  })

  describe('initialiseDogsForDeletion', () => {
    test('should set dogs', () => {
      const dogIndexNumbers = [{ indexNumber: 'ED12345' }, { indexNumber: 'ED23456' }]

      initialiseDogsForDeletion(mockRequest, dogIndexNumbers)

      expect(mockRequest.yar.set).toHaveBeenCalledTimes(2)
      expect(mockRequest.yar.set.mock.calls[0]).toEqual(['oldDogs1', ['ED12345', 'ED23456']])
      expect(mockRequest.yar.set.mock.calls[1]).toEqual(['oldDogs2', []])
    })
  })
})
