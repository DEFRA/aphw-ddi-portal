const { getPoliceUsersToAdd, setPoliceUsersToAdd, initialisePoliceUsers, appendPoliceUserToAdd, removePoliceUserToAdd } = require('../../../../app/session/admin/police-users')

describe('police-users', () => {
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

  describe('getPoliceUsersToAdd', () => {
    test('given they exist', () => {
      const policeUsernames = [
        'ralph@wreckit.com',
        'scott.turner@sacramento.police.gov',
        'axel.foley@beverly-hills.police.gov'
      ]

      mockRequest.yar.get.mockReturnValue(policeUsernames)

      const policeUsers = getPoliceUsersToAdd(mockRequest)
      expect(policeUsers).toEqual(policeUsernames)
      expect(mockRequest.yar.get).toHaveBeenCalledWith('policeUsers')
      expect(mockRequest.yar.set).not.toHaveBeenCalled()
    })

    test('given none exist', () => {
      mockRequest.yar.get.mockReturnValue(undefined)

      const policeUsers = getPoliceUsersToAdd(mockRequest)
      expect(policeUsers).toEqual([])
    })
  })

  describe('setPoliceUsersToAdd', () => {
    test('should set single police user ', () => {
      const policeUser = 'nicholas.angel@sandford.police.uk'

      setPoliceUsersToAdd(mockRequest, policeUser)
      expect(mockRequest.yar.set).toHaveBeenCalledWith('policeUsers', [policeUser])
    })

    test('should set multiple police users', () => {
      const policeUsernames = ['nicholas.angel@sandford.police.uk', 'danny.butterman@sandford.police.uk']

      setPoliceUsersToAdd(mockRequest, policeUsernames)
      expect(mockRequest.yar.set).toHaveBeenCalledWith('policeUsers', policeUsernames)
    })

    test('should set empty array if empty', () => {
      setPoliceUsersToAdd(mockRequest, undefined)
      expect(mockRequest.yar.set).toHaveBeenCalledWith('policeUsers', [])
    })
  })

  describe('initialisePoliceUsers', () => {
    test('should set policeUsers session key to empty array', () => {
      initialisePoliceUsers(mockRequest)
      expect(mockRequest.yar.set).toHaveBeenCalledWith('policeUsers', [])
    })
  })

  describe('appendPoliceUserToAdd', () => {
    test('should add a single new police user to an empty list of police users', () => {
      const policeUsernames = 'nicholas.angel@sandford.police.uk'
      mockRequest.yar.get.mockReturnValue([])

      appendPoliceUserToAdd(mockRequest, policeUsernames)

      expect(mockRequest.yar.set).toHaveBeenCalledWith('policeUsers', ['nicholas.angel@sandford.police.uk'])
    })

    test('should not add a police user given user is not included', () => {
      const policeUsernames = ['nicholas.angel@sandford.police.uk']
      mockRequest.yar.get.mockReturnValue(policeUsernames)

      appendPoliceUserToAdd(mockRequest, undefined)

      expect(mockRequest.yar.set).toHaveBeenCalledWith('policeUsers', ['nicholas.angel@sandford.police.uk'])
    })

    test('should add a list of police users to an empty list of police users', () => {
      const policeUsernames = ['nicholas.angel@sandford.police.uk', 'danny.butterman@sandford.police.uk']
      mockRequest.yar.get.mockReturnValue([])

      appendPoliceUserToAdd(mockRequest, policeUsernames)

      expect(mockRequest.yar.set).toHaveBeenCalledWith('policeUsers', ['nicholas.angel@sandford.police.uk', 'danny.butterman@sandford.police.uk'])
    })

    test('should add a police user to a list of police users', () => {
      const policeUsernames = 'danny.butterman@sandford.police.uk'
      mockRequest.yar.get.mockReturnValue(['nicholas.angel@sandford.police.uk'])

      appendPoliceUserToAdd(mockRequest, policeUsernames)

      expect(mockRequest.yar.set).toHaveBeenCalledWith('policeUsers', ['nicholas.angel@sandford.police.uk', 'danny.butterman@sandford.police.uk'])
    })

    test('should add a list of police users to a list of police users', () => {
      const policeUsernames = ['axel.foley@beverly-hills.police.gov', 'scott.turner@sacramento.police.gov']
      mockRequest.yar.get.mockReturnValue(['nicholas.angel@sandford.police.uk', 'danny.butterman@sandford.police.uk'])

      appendPoliceUserToAdd(mockRequest, policeUsernames)

      expect(mockRequest.yar.set).toHaveBeenCalledWith('policeUsers', [
        'nicholas.angel@sandford.police.uk',
        'danny.butterman@sandford.police.uk',
        'axel.foley@beverly-hills.police.gov',
        'scott.turner@sacramento.police.gov'
      ])
    })
  })

  describe('removePoliceUserToAdd', () => {
    test('should remove a police user from the session', () => {
      const policeUsernames = [
        'ralph@wreckit.com',
        'scott.turner@sacramento.police.gov',
        'axel.foley@beverly-hills.police.gov'
      ]

      mockRequest.yar.get.mockReturnValue(policeUsernames)
      removePoliceUserToAdd(mockRequest, 0)
      expect(mockRequest.yar.set).toHaveBeenCalledWith('policeUsers', [
        'scott.turner@sacramento.police.gov',
        'axel.foley@beverly-hills.police.gov'
      ])
    })
  })
})
