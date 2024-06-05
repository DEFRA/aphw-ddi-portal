const { getOrphanedOwnersForDeletion, setOrphanedOwnersForDeletion, consumeOrphanedOwnersForDeletion } = require('../../../../app/session/admin/delete-owners')
describe('delete-owner', () => {
  const mockRequest = {
    yar: {
      get: jest.fn(),
      set: jest.fn()
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getOrphanedOwnersForDeletion', () => {
    test('getOrphanedOwnersForDeletion given they exist', () => {
      const ownerReferenceIds = ['P-418F-024E']

      mockRequest.yar.get.mockReturnValue(ownerReferenceIds)

      const ownerReferences = getOrphanedOwnersForDeletion(mockRequest)
      expect(ownerReferences).toEqual(ownerReferenceIds)
      expect(mockRequest.yar.get).toHaveBeenCalledWith('orphanedOwners')
      expect(mockRequest.yar.set).not.toHaveBeenCalled()
    })

    test('getOrphanedOwnersForDeletion given none exist', () => {
      mockRequest.yar.get.mockReturnValue(undefined)

      const ownerReferences = getOrphanedOwnersForDeletion(mockRequest)
      expect(ownerReferences).toEqual([])
    })
  })

  describe('setOrphanedOwnersForDeletion', () => {
    test('should set single owner', () => {
      const ownerReferenceId = 'P-418F-024E'

      setOrphanedOwnersForDeletion(mockRequest, ownerReferenceId)
      expect(mockRequest.yar.set).toHaveBeenCalledWith('orphanedOwners', [ownerReferenceId])
    })

    test('should set multiple owners', () => {
      const ownerReferenceIds = ['P-418F-024E', 'P-585C-C9B5']

      setOrphanedOwnersForDeletion(mockRequest, ownerReferenceIds)
      expect(mockRequest.yar.set).toHaveBeenCalledWith('orphanedOwners', ownerReferenceIds)
    })
  })

  describe('consumeOrphanedOwnersForDeletion', () => {
    test('should get owners and clear the cache', () => {
      const ownerReferenceIds = ['P-418F-024E']

      mockRequest.yar.get.mockReturnValue(ownerReferenceIds)

      const ownerReferences = consumeOrphanedOwnersForDeletion(mockRequest)
      expect(ownerReferences).toEqual(ownerReferenceIds)
      expect(mockRequest.yar.get).toHaveBeenCalledWith('orphanedOwners')
      expect(mockRequest.yar.set).toHaveBeenCalledWith('orphanedOwners', [])
    })
  })
})
