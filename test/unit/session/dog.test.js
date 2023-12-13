const { getDog, setDog, getDogs, deleteDog } = require('../../../app/session/cdo/dog')

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
    mockRequest.yar.get.mockReturnValue([{
      name: 'Fido',
      breed: 'Breed 1'
    }])

    const dog = getDog(mockRequest)

    expect(mockRequest.yar.get).toHaveBeenCalledTimes(1)
    expect(mockRequest.yar.get).toHaveBeenCalledWith('dogs')
    expect(dog).toEqual({
      name: 'Fido',
      breed: 'Breed 1'
    })
  })

  test('getDog with id returns dog from session', () => {
    const requestWithParams = {
      ...mockRequest,
      params: {
        dogId: 2
      }
    }

    requestWithParams.yar.get.mockReturnValue([{
      name: 'Fido',
      breed: 'Breed 1'
    }, {
      name: 'Buster',
      breed: 'Breed 2'
    }])

    const dog = getDog(requestWithParams)

    expect(requestWithParams.yar.get).toHaveBeenCalledTimes(1)
    expect(requestWithParams.yar.get).toHaveBeenCalledWith('dogs')
    expect(dog).toEqual({
      name: 'Buster',
      breed: 'Breed 2'
    })
  })

  test('setDog sets dog in session', () => {
    mockRequest.yar.get.mockReturnValue(undefined)

    const dog = {
      name: 'Fido',
      breed: 'Breed 1'
    }

    setDog(mockRequest, dog)

    expect(mockRequest.yar.set).toHaveBeenCalledTimes(1)
    expect(mockRequest.yar.set).toHaveBeenCalledWith('dogs', [{
      name: 'Fido',
      breed: 'Breed 1'
    }])
  })

  test('setDog with id updates dog in session', () => {
    mockRequest.yar.get.mockReturnValue([{
      name: 'Fido',
      breed: 'Breed 1'
    }, {
      name: 'Buster',
      breed: 'Breed 2'
    }])

    const dog = {
      id: 2,
      name: 'Alice',
      breed: 'Breed 2'
    }

    setDog(mockRequest, dog)

    expect(mockRequest.yar.set).toHaveBeenCalledTimes(1)
    expect(mockRequest.yar.set).toHaveBeenCalledWith('dogs', [{
      name: 'Fido',
      breed: 'Breed 1'
    }, {
      name: 'Alice',
      breed: 'Breed 2'
    }])
  })

  test('getDogs returns dogs from session', () => {
    mockRequest.yar.get.mockReturnValue([{
      name: 'Fido',
      breed: 'Breed 1'
    }, {
      name: 'Buster',
      breed: 'Breed 2'
    }])

    const dogs = getDogs(mockRequest)

    expect(mockRequest.yar.get).toHaveBeenCalledTimes(1)
    expect(mockRequest.yar.get).toHaveBeenCalledWith('dogs')
    expect(dogs).toEqual([{
      name: 'Fido',
      breed: 'Breed 1'
    }, {
      name: 'Buster',
      breed: 'Breed 2'
    }])
  })

  test('deleteDog deletes dog from session', () => {
    const requestWithPayload = {
      ...mockRequest,
      payload: {
        dogId: 1
      }
    }

    requestWithPayload.yar.get.mockReturnValue([{
      name: 'Fido',
      breed: 'Breed 1'
    }, {
      name: 'Buster',
      breed: 'Breed 2'
    }])

    deleteDog(requestWithPayload, 1)

    expect(requestWithPayload.yar.set).toHaveBeenCalledTimes(1)
    expect(requestWithPayload.yar.set).toHaveBeenCalledWith('dogs', [{
      name: 'Buster',
      breed: 'Breed 2'
    }])
  })
})
