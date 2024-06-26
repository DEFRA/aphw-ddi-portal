const {
  getOrphanedOwnersForDeletion, setOrphanedOwnersForDeletion,
  initialiseOwnersForDeletion
} = require('../../../../app/session/admin/delete-owners')

describe('delete-owner', () => {
  const mockRequest = {
    yar: {
      get: jest.fn(),
      set: jest.fn(),
      clear: jest.fn()
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
      const ownerReferenceIds = ['P-418F-024E']

      setOrphanedOwnersForDeletion(mockRequest, ownerReferenceIds)
      expect(mockRequest.yar.set).toHaveBeenCalledWith('orphanedOwners', ownerReferenceIds)
    })

    test('should set empty array if empty', () => {
      setOrphanedOwnersForDeletion(mockRequest, undefined)
      expect(mockRequest.yar.set).toHaveBeenCalledWith('orphanedOwners', [])
    })
  })

  describe('initialiseOwnersForDeletion', () => {
    test('should set owners', () => {
      const ownerReferenceIds = ['P-418F-024E']

      initialiseOwnersForDeletion(mockRequest, [{ personReference: 'P-418F-024E' }])

      expect(mockRequest.yar.set).toHaveBeenCalledWith('orphanedOwners', ownerReferenceIds)
    })
  })
})
