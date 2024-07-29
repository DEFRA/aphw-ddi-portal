jest.mock('../../../../app/api/ddi-index-api/base')
const { post, callDelete, get } = require('../../../../app/api/ddi-index-api/base')

const { addPoliceForce, removePoliceForce, getPoliceForces } = require('../../../../app/api/ddi-index-api/police-forces')
const { user } = require('../../../mocks/auth')
const { ApiConflictError } = require('../../../../app/errors/api-conflict-error')

describe('DDI API policeForces', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getPoliceForces', () => {
    test('should get courts', async () => {
      const policeForces = [{
        id: 1,
        name: 'Isengard Constabulary'
      }]
      get.mockResolvedValue({
        policeForces
      })

      const gotPoliceForces = await getPoliceForces()
      expect(gotPoliceForces).toEqual(policeForces)
      expect(get).toHaveBeenCalledWith('police-forces', { json: true })
    })
  })

  describe('addPoliceForce', () => {
    test('should create a new policeForce', async () => {
      const name = 'Rivendell Constabulary'
      const expectedPoliceForce = {
        id: 29,
        name
      }
      post.mockResolvedValue(expectedPoliceForce)

      /**
       * @type {PoliceForceRequest}
       */
      const policeForce = { name }
      const createdPolicForce = await addPoliceForce(policeForce, user)
      expect(createdPolicForce).toEqual(expectedPoliceForce)
      expect(post).toHaveBeenCalledWith('police-forces', policeForce, user)
    })

    test('should throw an ApiConflictError given there is a duplicate', async () => {
      post.mockRejectedValue({
        isBoom: true,
        output: {
          statusCode: 409,
          payload: {
            statusCode: 409,
            error: 'Conflict',
            message: 'Response Error: 409 Conflict'
          },
          headers: {}
        }
      })

      await expect(addPoliceForce({ name: 'Rivendell Constabulary' }, user)).rejects.toThrow(new ApiConflictError({ message: 'This police force is already listed' }))
    })

    test('should throw a normal error given there is an error code other than 409', async () => {
      post.mockRejectedValue(new Error('server error'))

      await expect(addPoliceForce({ name: 'Rivendell Constabulary' }, user)).rejects.toThrow(new Error('server error'))
    })
  })

  describe('removePoliceForce', () => {
    test('should create a new policeForce', async () => {
      const policeForceId = 29

      callDelete.mockResolvedValue()

      await removePoliceForce(policeForceId, user)

      expect(callDelete).toHaveBeenCalledWith('police-forces/29', user)
    })
  })
})
