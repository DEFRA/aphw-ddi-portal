const { getDog, setDog } = require('../../../app/session/dog')

describe('dog session storage', () => {
  test('getDog returns dog from session', () => {
    const dog = {
      name: 'Fido',
      breed: 'Labrador'
    }

    const request = {
      yar: {
        get: jest.fn().mockReturnValue(dog)
      }
    }

    const result = getDog(request)

    expect(result).toEqual(dog)
  })

  test('setDog sets dog in session', () => {
    const dog = {
      name: 'Fido',
      breed: 'Labrador'
    }

    const request = {
      yar: {
        set: jest.fn()
      }
    }

    setDog(request, dog)

    expect(request.yar.set).toHaveBeenCalledWith('dog', dog)
  })
})
