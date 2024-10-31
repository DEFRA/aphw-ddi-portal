const {
  getOwnerBase,
  setOwnerBase,
  getAddress,
  setAddress,
  getOwnerDetails,
  setOwnerDetails,
  getEnforcementDetails,
  setEnforcementDetails,
  getPostcodeLookupDetails,
  setPostcodeLookupDetails,
  clearPostcodeSession
} = require('../../../../app/session/cdo/owner')

describe('cdo activity session helpers', () => {
  const mockRequest = {
    yar: {
      get: jest.fn(),
      set: jest.fn()
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getOwnerBase', () => {
    test('should get whole owner if needed', () => {
      const ownerInSession = {
        ownerDetails: {
          firstName: 'Julie',
          lastName: 'Reyes'
        }
      }
      mockRequest.yar.get.mockReturnValue(ownerInSession)
      const owner = getOwnerBase(mockRequest, 'owner')
      expect(owner).toEqual(ownerInSession)
    })
  })

  describe('setOwnerBase', () => {
    test('should set individual property if needed', () => {
      const ownerInSession = {
        key: 'string'
      }
      mockRequest.yar.get.mockReturnValue(ownerInSession)
      setOwnerBase(mockRequest, 'owner', 'key', ' string2 ')
      expect(mockRequest.yar.set).toHaveBeenCalledWith('owner', { key: 'string2' })
    })
  })

  describe('getAddress', () => {
    test('should get address given one exists', () => {
      const address = {
        addressLine1: '1 Bag End',
        addressLine2: null,
        town: 'Hobbiton',
        county: 'The Shire',
        postcode: 'SH2 2AA'
      }
      mockRequest.yar.get.mockReturnValue({
        address
      })
      const gotAddress = getAddress(mockRequest)
      expect(gotAddress).toEqual(address)
    })

    test('should get address given none exists', () => {
      mockRequest.yar.get.mockReturnValue(undefined)
      const address = getAddress(mockRequest)
      expect(address).toEqual({})
    })
  })

  describe('setAddress', () => {
    test('should set address given one exists', () => {
      const address = {
        addressLine1: '1 Bag End',
        addressLine2: 'Bagshot Row',
        town: 'Hobbiton',
        county: 'The Shire',
        postcode: 'SH2 2AA'
      }
      const expectedAddress = {
        ...address,
        addressLine1: '3 Bag End'
      }
      mockRequest.yar.get.mockReturnValue({
        address
      })
      setAddress(mockRequest, expectedAddress)
      expect(mockRequest.yar.set).toHaveBeenCalledWith('owner', { address: expectedAddress })
    })
  })

  describe('getOwnerDetails', () => {
    test('should get owner details given they exist', () => {
      const expectedOwnerDetails = {
        firstName: 'John',
        lastName: 'Smith'
      }
      mockRequest.yar.get.mockReturnValue({
        ownerDetails: expectedOwnerDetails
      })
      const ownerDetails = getOwnerDetails(mockRequest)
      expect(mockRequest.yar.get).toHaveBeenCalledWith('owner')
      expect(ownerDetails).toEqual(expectedOwnerDetails)
    })
  })

  describe('setOwnerDetails', () => {
    test('should get owner details given they exist', () => {
      const expectedOwnerDetails = {
        firstName: 'John',
        lastName: 'Smith'
      }
      mockRequest.yar.get.mockReturnValue({
        ownerDetails: expectedOwnerDetails
      })
      setOwnerDetails(mockRequest, expectedOwnerDetails)
      expect(mockRequest.yar.get).toHaveBeenCalledWith('owner')
      expect(mockRequest.yar.set).toHaveBeenCalledWith('owner', {
        ownerDetails: expectedOwnerDetails
      })
    })

    test('should get owner details given they exist', () => {
      const expectedOwnerDetails = {
        firstName: 'John',
        lastName: 'Smith'
      }
      mockRequest.yar.get.mockReturnValue(undefined)
      setOwnerDetails(mockRequest, expectedOwnerDetails)
      expect(mockRequest.yar.set).toHaveBeenCalledWith('owner', {
        ownerDetails: expectedOwnerDetails
      })
    })
  })

  describe('getEnforcementDetails', () => {
    test('should get Enforcement Details given they exist', () => {
      const enforcementDetails = {
        court: 'court2',
        policeForce: 'police-force-5',
        legislationOfficer: 'DLO1'
      }
      mockRequest.yar.get.mockReturnValue({
        enforcementDetails
      })
      const foundEnforcementDetails = getEnforcementDetails(mockRequest)
      expect(mockRequest.yar.get).toHaveBeenCalledWith('owner')
      expect(foundEnforcementDetails).toEqual(enforcementDetails)
    })
  })

  describe('setEnforcementDetails', () => {
    test('should set Enforcement Details', () => {
      const enforcementDetails = {
        court: 'court2',
        policeForce: 'police-force-5',
        legislationOfficer: 'DLO1'
      }
      mockRequest.yar.get.mockReturnValue(undefined)
      setEnforcementDetails(mockRequest, enforcementDetails)
      expect(mockRequest.yar.set).toHaveBeenCalledWith('owner', {
        enforcementDetails
      })
    })

    test('should get owner details given they exist', () => {
      const expectedOwnerDetails = {
        firstName: 'John',
        lastName: 'Smith'
      }
      mockRequest.yar.get.mockReturnValue(undefined)
      setOwnerDetails(mockRequest, expectedOwnerDetails)
      expect(mockRequest.yar.set).toHaveBeenCalledWith('owner', {
        ownerDetails: expectedOwnerDetails
      })
    })
  })

  describe('getPostcodeLookupDetails', () => {
    test('should get Enforcement Details given they exist', () => {
      const postcodeLookup = { postcode: 'ts1 1ts', houseNumber: 'house1' }
      mockRequest.yar.get.mockReturnValue({
        postcodeLookup
      })
      const postcodeLookupDetails = getPostcodeLookupDetails(mockRequest)
      expect(mockRequest.yar.get).toHaveBeenCalledWith('owner')
      expect(postcodeLookupDetails).toEqual(postcodeLookup)
    })
  })

  describe('setPostcodeLookupDetails', () => {
    test('should get owner details given they do not exist', () => {
      const postcodeLookup = { postcode: 'ts1 1ts', houseNumber: 'house1' }
      mockRequest.yar.get.mockReturnValue(undefined)
      setPostcodeLookupDetails(mockRequest, postcodeLookup)
      expect(mockRequest.yar.set).toHaveBeenCalledWith('owner', {
        postcodeLookup
      })
    })
  })

  describe('clearPostcodeSession', () => {
    test('should clear sessionr details', () => {
      mockRequest.yar.set.mockReturnValue(undefined)
      clearPostcodeSession(mockRequest)
      expect(mockRequest.yar.set).toHaveBeenCalledTimes(2)
      expect(mockRequest.yar.set).toHaveBeenNthCalledWith(1, 'owner', { postcodeLookup: null })
      expect(mockRequest.yar.set).toHaveBeenNthCalledWith(2, 'owner', { address: null })
    })
  })
})
