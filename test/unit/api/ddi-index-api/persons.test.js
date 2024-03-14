
const { getPersons } = require('../../../../app/api/ddi-index-api/persons')
const { get } = require('../../../../app/api/ddi-index-api/base')
jest.mock('../../../../app/api/ddi-index-api/base')

describe('Persons test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getPersons', () => {
    test('should get people filtered by firstName and lastName', async () => {
      get.mockResolvedValue({ payload: {} })
      await getPersons({
        firstName: 'Homer',
        lastName: 'Simpson'
      })
      expect(get).toBeCalledWith('persons?firstName=Homer&lastName=Simpson', expect.anything())
    })

    test('should get people filtered by firstName and lastName and filter dobDay, dobMonth, dobYear', async () => {
      get.mockResolvedValue({ payload: {} })
      await getPersons({
        firstName: 'Homer',
        lastName: 'Simpson',
        dobDay: '',
        dobMonth: '',
        dobYear: ''
      })
      expect(get).toBeCalledWith('persons?firstName=Homer&lastName=Simpson', expect.anything())
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
      })
      expect(get).toBeCalledWith('persons?firstName=Homer&lastName=Simpson&dateOfBirth=1998-05-10', expect.anything())
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
      })
      expect(get).toBeCalledWith('persons?firstName=Homer&lastName=Simpson&dateOfBirth=1998-05-10', expect.anything())
    })

    test('should throw an error given empty object', async () => {
      get.mockResolvedValue({ payload: {} })
      await expect(getPersons({})).rejects.toThrow('ValidationError: "firstName" is required. "lastName" is required')
    })

    test('should strip invalid query params', async () => {
      get.mockResolvedValue({ payload: {} })
      await expect(getPersons({
        firstName: 'Homer',
        lastName: 'Simpson',
        queryParam: '1234'
      }))
      expect(get).toBeCalledWith('persons?firstName=Homer&lastName=Simpson', expect.anything())
    })
  })
})
