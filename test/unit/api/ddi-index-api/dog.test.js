const { user, adminUser } = require('../../../mocks/auth')
const { updateStatus, getDogDetails, updateDogDetails, getDogOwner, deleteDog, getDogOwnerWithDogs, withdrawDog } = require('../../../../app/api/ddi-index-api/dog')
jest.mock('../../../../app/api/ddi-index-api/base')
const { get, post, callDelete, boomRequest } = require('../../../../app/api/ddi-index-api/base')
const { ApiErrorFailure } = require('../../../../app/errors/api-error-failure')
const { ApiConflictError } = require('../../../../app/errors/api-conflict-error')

const validDog = {
  dog: {
    name: 'Bruno',
    id: 123
  }
}

const validUpdateStatusPayload = {
  indexNumber: 'ED123',
  newStatus: 'Exempt',
  microchipNumber: '875257109325923'
}

describe('Dog test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('updateStatus', () => {
    test('updateStatus calls post with valid payload', async () => {
      boomRequest.mockResolvedValue({ statusCode: 200, statusMessage: 123, payload: 123 })
      get.mockResolvedValue(validDog)
      const res = await updateStatus(validUpdateStatusPayload, user)
      expect(res).not.toEqual(null)
      expect(res).toEqual({ statusCode: 200, statusMessage: 123, payload: 123 })
      expect(boomRequest).toHaveBeenCalledWith('dog', 'PUT', { name: 'Bruno', id: 123, dogId: 123, status: 'Exempt' }, user)
    })

    test('should throw an ApiConflictError given 409 Conflict', async () => {
      const apiErrorFailure = new ApiErrorFailure('409 Conflict', {
        statusCode: 409,
        error: 'Conflict',
        message: 'Microchip number already exists',
        microchipNumbers: [
          '875257109325923'
        ]
      })
      boomRequest.mockRejectedValue(apiErrorFailure)
      get.mockResolvedValue(validDog)

      const updateStatusCall = updateStatus(validUpdateStatusPayload, user)
      await expect(updateStatusCall).rejects.toThrow(new ApiConflictError(apiErrorFailure))
    })

    test('should throw an ApiConflictError given 409 Conflict', async () => {
      const apiErrorFailure = new ApiErrorFailure('500 Error', {
        statusCode: 500,
        error: 'Server error',
        message: 'Server error'
      })
      boomRequest.mockRejectedValue(apiErrorFailure)
      get.mockResolvedValue(validDog)

      const updateStatusCall = updateStatus(validUpdateStatusPayload, user)
      await expect(updateStatusCall).rejects.toThrow(new ApiConflictError(apiErrorFailure))
    })

    test('should throw a standard error given 500 error', async () => {
      const apiErrorFailure = new Error('server error')
      boomRequest.mockRejectedValue(apiErrorFailure)
      get.mockResolvedValue(validDog)

      const updateStatusCall = updateStatus(validUpdateStatusPayload, user)
      await expect(updateStatusCall).rejects.toThrow(new Error('server error'))
    })

    test('updateStatus doesnt call boomRequest with invalid payload', async () => {
      post.mockResolvedValue()
      await expect(updateStatus({})).rejects.toThrow()
      expect(boomRequest).not.toHaveBeenCalled()
    })
  })

  describe('getDogDetails', () => {
    test('getDogDetails calls endpoint', async () => {
      get.mockResolvedValue({ payload: {} })
      await getDogDetails('ED12345', user)
      expect(get).toHaveBeenCalledWith('dog/ED12345', user)
    })
  })

  describe('getDogOwner', () => {
    test('getDogOwner calls endpoint', async () => {
      get.mockResolvedValue({ payload: {} })
      await getDogOwner('ED12345', user)
      expect(get).toHaveBeenCalledWith('dog-owner/ED12345', user)
    })
  })

  describe('getDogOwnerWithDogs', () => {
    test('should calls endpoint', async () => {
      get.mockResolvedValue({ payload: {} })
      await getDogOwnerWithDogs('ED12345', user)
      expect(get).toHaveBeenCalledWith('dog-owner/ED12345?includeDogs=true', user)
    })
  })

  describe('updateDogDetails', () => {
    test('updateDogDetails calls endpoint', async () => {
      boomRequest.mockResolvedValue({ statusCode: 200, statusMessage: 'ok', payload: 123 })

      await updateDogDetails({ id: 123 }, user)
      expect(boomRequest).toHaveBeenCalledWith('dog', 'PUT', { id: 123, dogId: 123 }, user)
    })

    test('updateDogDetails should return the response object given api request failed', async () => {
      const apiErrorFailure = new ApiErrorFailure('409 Conflict', {
        statusCode: 409,
        error: 'Conflict',
        message: 'Microchip number already exists',
        microchipNumbers: [
          '875257109325923'
        ]
      })
      boomRequest.mockRejectedValue(apiErrorFailure)
      const updatedDog = {
        id: 123,
        microchipNumber: '123',
        microchipNumber2: '456'
      }

      await expect(updateDogDetails(updatedDog, adminUser)).rejects.toThrow(ApiConflictError)
      await expect(updateDogDetails(updatedDog, adminUser)).rejects.toThrow(new ApiConflictError(apiErrorFailure))
    })

    test('updateDogDetails should return the response object given api request failed with 500 error', async () => {
      const apiErrorFailure = new ApiErrorFailure('500 Internal Server Error', { error: 'Internal Server Error', message: 'Internal Server Error', statusCode: 500 })
      boomRequest.mockRejectedValue(apiErrorFailure)
      const updatedDog = {
        id: 123,
        microchipNumber: '123',
        microchipNumber2: '456'
      }

      await expect(updateDogDetails(updatedDog, adminUser)).rejects.toThrow(ApiErrorFailure)
      await expect(updateDogDetails(updatedDog, adminUser)).rejects.not.toThrow(ApiConflictError)
    })

    test('updateDogDetails should return the response object given unknown error', async () => {
      const apiErrorFailure = new Error('oops')
      boomRequest.mockRejectedValue(apiErrorFailure)
      const updatedDog = {
        id: 123,
        microchipNumber: '123',
        microchipNumber2: '456'
      }
      await expect(updateDogDetails(updatedDog, adminUser)).rejects.toThrow(Error)
      await expect(updateDogDetails(updatedDog, adminUser)).rejects.not.toThrow(ApiErrorFailure)
    })
  })

  describe('deleteDog', () => {
    test('deleteDog calls endpoint', async () => {
      callDelete.mockResolvedValue(true)
      await deleteDog('ED123', user)
      expect(callDelete).toHaveBeenCalledWith('dog/ED123', user)
    })
  })

  describe('withdrawDog', () => {
    test('withdrawDog calls endpoint', async () => {
      post.mockResolvedValue()
      await withdrawDog({ indexNumber: 'ED123', withdrawOption: 'post' }, user)
      expect(post).toHaveBeenCalledWith('dog/withdraw/ED123', { indexNumber: 'ED123', withdrawOption: 'post' }, user)
    })
  })
})
