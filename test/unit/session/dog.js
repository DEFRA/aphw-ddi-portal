const { getDog, setDog } = require('../../../app/session/dog')

describe('dog session storage', () => {
  const mockRequest = {
    yar: {
      get: jest.fn(),
      set: jest.fn()
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('getDog returns dog from session', () => {
    mockRequest.yar.get.mockReturnValue({
      name: 'Fido',
      breed: 'Breed 1'
    })

    const dog = getDog(mockRequest)

    expect(mockRequest.yar.get).toHaveBeenCalledTimes(1)
    expect(mockRequest.yar.get).toHaveBeenCalledWith('dog')
    expect(dog).toEqual({
      name: 'Fido',
      breed: 'Breed 1'
    })
  })

  test('setDog sets dog in session', () => {
    const dog = {
      name: 'Fido',
      breed: 'Breed 1'
    }

    setDog(mockRequest, dog)

    expect(mockRequest.yar.set).toHaveBeenCalledTimes(1)
    expect(mockRequest.yar.set).toHaveBeenCalledWith('dog', dog)
  })
})
