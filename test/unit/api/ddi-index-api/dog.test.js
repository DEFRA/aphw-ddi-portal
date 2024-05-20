const { user, adminUser } = require('../../../mocks/auth')
const { updateStatus, getDogDetails, updateDogDetails, getDogOwner, deleteDog } = require('../../../../app/api/ddi-index-api/dog')
jest.mock('../../../../app/api/ddi-index-api/base')
const { get, post, put, callDelete, boomRequest } = require('../../../../app/api/ddi-index-api/base')
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
  newStatus: 'Exempt'
}

describe('Dog test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('updateStatus', () => {
    test('updateStatus calls post with valid payload', async () => {
      put.mockResolvedValue(123)
      get.mockResolvedValue(validDog)
      const res = await updateStatus(validUpdateStatusPayload, user)
      expect(res).not.toBe(null)
      expect(res).toBe(123)
      expect(put).toHaveBeenCalledWith('dog', { name: 'Bruno', id: 123, dogId: 123, status: 'Exempt' }, user)
    })

    test('updateStatus doesnt call put with invalid payload', async () => {
      post.mockResolvedValue()
      await expect(updateStatus({})).rejects.toThrow()
      expect(put).not.toHaveBeenCalled()
    })
  })

  describe('getDogDetails', () => {
    test('getDogDetails calls endpoint', async () => {
      get.mockResolvedValue({ payload: {} })
      await getDogDetails('ED12345')
      expect(get).toHaveBeenCalledWith('dog/ED12345', expect.anything())
    })
  })

  describe('getDogOwner', () => {
    test('getDogOwner calls endpoint', async () => {
      get.mockResolvedValue({ payload: {} })
      await getDogOwner('ED12345')
      expect(get).toHaveBeenCalledWith('dog-owner/ED12345', expect.anything())
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
        message: 'The microchip number already exists',
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
})
