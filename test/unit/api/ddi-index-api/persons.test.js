const { user } = require('../../../mocks/auth')

describe('Persons test', () => {
  const { getPersons, getOrphanedOwners, bulkDeletePersons } = require('../../../../app/api/ddi-index-api/persons')
  jest.mock('../../../../app/api/ddi-index-api/base')
  const { get, post } = require('../../../../app/api/ddi-index-api/base')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getPersons', () => {
    test('should get people filtered by firstName and lastName', async () => {
      get.mockResolvedValue({ payload: {} })
      await getPersons({
        firstName: 'Homer',
        lastName: 'Simpson'
      }, user)
      expect(get).toBeCalledWith('persons?firstName=Homer&lastName=Simpson', user)
    })

    test('should get people filtered by firstName and lastName and filter dobDay, dobMonth, dobYear', async () => {
      get.mockResolvedValue({ payload: {} })
      await getPersons({
        firstName: 'Homer',
        lastName: 'Simpson',
        dobDay: '',
        dobMonth: '',
        dobYear: ''
      }, user)
      expect(get).toBeCalledWith('persons?firstName=Homer&lastName=Simpson', user)
    })

    test('should get people filtered by firstName and lastName and DOB', async () => {
      get.mockResolvedValue({ payload: {} })
      await getPersons({
        firstName: 'Homer',
        lastName: 'Simpson',
        dateOfBirth: '1998-05-10',
        dobDay: '10',
        dobMonth: '05',
        dobYear: '1998'
      }, user)
      expect(get).toBeCalledWith('persons?firstName=Homer&lastName=Simpson&dateOfBirth=1998-05-10', user)
    })

    test('should get people filtered by firstName and lastName and DOB as Date', async () => {
      get.mockResolvedValue({ payload: {} })
      await getPersons({
        firstName: 'Homer',
        lastName: 'Simpson',
        dateOfBirth: new Date('1998-05-10'),
        dobDay: '10',
        dobMonth: '05',
        dobYear: '1998'
      }, user)
      expect(get).toBeCalledWith('persons?firstName=Homer&lastName=Simpson&dateOfBirth=1998-05-10', user)
    })

    test('should throw an error given empty object', async () => {
      get.mockResolvedValue({ payload: {} })
      await expect(getPersons({}, user)).rejects.toThrow('ValidationError: "value" must contain at least one of [firstName, orphaned]')
    })

    test('should strip invalid query params', async () => {
      get.mockResolvedValue({ payload: {} })
      await expect(getPersons({
        firstName: 'Homer',
        lastName: 'Simpson',
        queryParam: '1234'
      }, user))
      expect(get).toBeCalledWith('persons?firstName=Homer&lastName=Simpson', user)
    })
  })

  describe('getOrphanedOwners', () => {
    test('should get people filtered by orphaned = true', async () => {
      get.mockResolvedValue({
        payload: {
          persons: [
            {
              firstName: 'Abby',
              lastName: 'Breitenberg',
              birthDate: '1998-05-10',
              personReference: 'P-418F-024E',
              address: {
                addressLine1: '218 White Knoll',
                addressLine2: 'Anywhere Estate',
                town: 'Lake Keatonmouth',
                postcode: 'S1 1AA',
                country: 'England'
              },
              contacts: {
                emails: [],
                primaryTelephones: [],
                secondaryTelephones: []
              }
            }
          ]
        }
      })
      await getOrphanedOwners(user)
      expect(get).toBeCalledWith('persons?limit=-1&sortKey=owner&sortOrder=ASC&orphaned=true', user)
    })
  })

  describe('bulkDeleteOrphanedOwners', () => {
    test('should bulk delete orphaned owners', async () => {
      post.mockResolvedValue({
        count: {
          failed: 0,
          success: 2
        },
        deleted: {
          success: [
            'P-EA6B-BEEB',
            'P-F5C7-1EA6'
          ],
          failed: []
        }
      })
      const orphanedOwners = ['P-418F-024E', 'P-4A91-4A4D']
      const results = await bulkDeletePersons(orphanedOwners, user)
      expect(post).toHaveBeenCalledWith('persons:batch-delete', { personReferences: orphanedOwners }, user)
      expect(results).toEqual({
        count: {
          failed: 0,
          success: 2
        },
        deleted: {
          success: [
            'P-EA6B-BEEB',
            'P-F5C7-1EA6'
          ],
          failed: []
        }
      })
    })
  })
})
