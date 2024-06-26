const {
  getDog,
  setDog,
  getDogs,
  deleteDog,
  getMicrochipResults,
  setMicrochipResults,
  renumberEntries,
  addAnotherDog,
  clearAllDogs,
  getExistingDogs,
  setExistingDogs
} = require('../../../app/session/cdo/dog')

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

  test('setDog throws error if dog not found in session', () => {
    mockRequest.yar.get.mockReturnValue([])

    const dog = {
      id: 2,
      name: 'Alice',
      breed: 'Breed 2'
    }

    expect(() => setDog(mockRequest, dog)).toThrow('Dog -1 does not exist')
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
      breed: 'Breed 2',
      dogId: 1
    }])
  })

  test('addAnotherDog sets new blank dog in session', () => {
    mockRequest.yar.get.mockReturnValue([])

    addAnotherDog(mockRequest)

    expect(mockRequest.yar.set).toHaveBeenCalledTimes(1)
    expect(mockRequest.yar.set).toHaveBeenCalledWith('dogs', [{}])
  })

  test('renumberEntries renumbers', () => {
    const dogs = [
      {
        name: 'Fido',
        breed: 'Breed 1',
        dogId: 2
      }, {
        name: 'Buster',
        breed: 'Breed 2',
        dogId: 5
      }, {
        name: 'Buruno',
        breed: 'Breed 3',
        dogId: 4
      }]

    renumberEntries(dogs)

    expect(dogs).toEqual([
      {
        name: 'Fido',
        breed: 'Breed 1',
        dogId: 1
      }, {
        name: 'Buster',
        breed: 'Breed 2',
        dogId: 2
      }, {
        name: 'Buruno',
        breed: 'Breed 3',
        dogId: 3
      }]
    )
  })

  test('renumberEntries handles no entries', () => {
    const dogs = null

    renumberEntries(dogs)

    expect(dogs).toBe(null)
  })

  test('getMicrochipDetails returns details from session', () => {
    mockRequest.yar.get.mockReturnValue({
      microchipNumber: '12345',
      results: [{ id: 1 }]
    })

    const details = getMicrochipResults(mockRequest)

    expect(mockRequest.yar.get).toHaveBeenCalledTimes(1)
    expect(mockRequest.yar.get).toHaveBeenCalledWith('microchipSearch')
    expect(details).toEqual({
      microchipNumber: '12345',
      results: [{ id: 1 }]
    })
  })

  test('getMicrochipDetails returns empty object if no details in session', () => {
    mockRequest.yar.get.mockReturnValue(null)

    const details = getMicrochipResults(mockRequest)

    expect(mockRequest.yar.get).toHaveBeenCalledTimes(1)
    expect(mockRequest.yar.get).toHaveBeenCalledWith('microchipSearch')
    expect(details).toEqual({})
  })

  test('setMicrochipDetails updates details in session', () => {
    mockRequest.yar.get.mockReturnValue({
      microchipNumber: '12345',
      results: [{ id: 1 }]
    })

    const details = {
      microchipNumber: '567890',
      results: [{ id: 2 }]
    }

    setMicrochipResults(mockRequest, details)

    expect(mockRequest.yar.set).toHaveBeenCalledTimes(1)
    expect(mockRequest.yar.set).toHaveBeenCalledWith('microchipSearch', {
      microchipNumber: '567890',
      results: [{ id: 2 }]
    })
  })

  test('clearAllDogs removes dog details from session', () => {
    clearAllDogs(mockRequest)

    expect(mockRequest.yar.set).toHaveBeenCalledTimes(1)
    expect(mockRequest.yar.set).toHaveBeenCalledWith('dogs', null)
  })

  test('getExistingDogs returns details from session', () => {
    mockRequest.yar.get.mockReturnValue([
      {
        name: 'Fido',
        breed: 'Breed 1',
        dogId: 1
      }, {
        name: 'Buster',
        breed: 'Breed 2',
        dogId: 2
      }, {
        name: 'Buruno',
        breed: 'Breed 3',
        dogId: 3
      }
    ])

    const details = getExistingDogs(mockRequest)

    expect(mockRequest.yar.get).toHaveBeenCalledTimes(1)
    expect(mockRequest.yar.get).toHaveBeenCalledWith('existingDogs')
    expect(details).toEqual([
      {
        name: 'Fido',
        breed: 'Breed 1',
        dogId: 1
      }, {
        name: 'Buster',
        breed: 'Breed 2',
        dogId: 2
      }, {
        name: 'Buruno',
        breed: 'Breed 3',
        dogId: 3
      }
    ])
  })

  test('getExistingDogs returns empty array if no details in session', () => {
    mockRequest.yar.get.mockReturnValue(null)

    const details = getExistingDogs(mockRequest)

    expect(mockRequest.yar.get).toHaveBeenCalledTimes(1)
    expect(mockRequest.yar.get).toHaveBeenCalledWith('existingDogs')
    expect(details).toEqual([])
  })

  test('getExistingDogs updates details in session', () => {
    mockRequest.yar.get.mockReturnValue([
      {
        name: 'Fido',
        breed: 'Breed 1',
        dogId: 1
      }, {
        name: 'Buster',
        breed: 'Breed 2',
        dogId: 2
      }
    ])

    const details = [
      {
        name: 'Fido',
        breed: 'Breed 1',
        dogId: 1
      }, {
        name: 'Buruno',
        breed: 'Breed 3',
        dogId: 3
      }
    ]

    setExistingDogs(mockRequest, details)

    expect(mockRequest.yar.set).toHaveBeenCalledTimes(1)
    expect(mockRequest.yar.set).toHaveBeenCalledWith('existingDogs', [
      {
        name: 'Fido',
        breed: 'Breed 1',
        dogId: 1
      }, {
        name: 'Buruno',
        breed: 'Breed 3',
        dogId: 3
      }
    ])
  })
})
