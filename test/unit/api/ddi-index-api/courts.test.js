jest.mock('../../../../app/api/ddi-index-api/base')
const { post, callDelete } = require('../../../../app/api/ddi-index-api/base')

const { addCourt, removeCourt } = require('../../../../app/api/ddi-index-api/courts')
const { user } = require('../../../mocks/auth')
const { ApiConflictError } = require('../../../../app/errors/api-conflict-error')

describe('DDI API courts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('addCourt', () => {
    test('should create a new court', async () => {
      const name = 'Rivendell Valley Court'
      const expectedCourt = {
        id: 29,
        name
      }
      post.mockResolvedValue(expectedCourt)

      /**
       * @type {CourtRequest}
       */
      const court = { name }
      const createdCourt = await addCourt(court, user)
      expect(createdCourt).toEqual(expectedCourt)
      expect(post).toHaveBeenCalledWith('courts', court, user)
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

      await expect(addCourt({ name: 'Rivendell Valley Court' }, user)).rejects.toThrow(new ApiConflictError({ message: 'This court name is already in the Index' }))
    })

    test('should throw a normal error given there is an error code other than 409', async () => {
      post.mockRejectedValue(new Error('server error'))

      await expect(addCourt({ name: 'Rivendell Valley Court' }, user)).rejects.toThrow(new Error('server error'))
    })
  })

  describe('removeCourt', () => {
    test('should create a new court', async () => {
      const courtId = 29

      callDelete.mockResolvedValue()

      await removeCourt(courtId, user)

      expect(callDelete).toHaveBeenCalledWith('courts/29', user)
    })
  })
})
