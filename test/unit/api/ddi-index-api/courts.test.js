jest.mock('../../../../app/api/ddi-index-api/base')
const { post, callDelete } = require('../../../../app/api/ddi-index-api/base')

const { addCourt, removeCourt } = require('../../../../app/api/ddi-index-api/courts')
const { user } = require('../../../mocks/auth')

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
