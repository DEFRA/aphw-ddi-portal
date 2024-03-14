const { user } = require('../../../mocks/auth')
const { addPerson, getPersonAndDogs, getPersonByReference, updatePerson } = require('../../../../app/api/ddi-index-api/person')
const { get, post, put } = require('../../../../app/api/ddi-index-api/base')
jest.mock('../../../../app/api/ddi-index-api/base')

const validPerson = {
  first_name: 'first',
  last_name: 'last'
}

const invalidPerson = {
  first_name: 'first'
}

describe('Person test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('addPerson', () => {
    test('addPerson calls post with valid person', async () => {
      post.mockResolvedValue({ references: [123] })
      const res = await addPerson(validPerson)
      expect(res).not.toBe(null)
      expect(res).toBe(123)
      expect(post).toHaveBeenCalledWith('person', { people: [validPerson] })
    })

    test('addPerson doesnt call post with invalid person', async () => {
      post.mockResolvedValue({ references: [456] })
      await expect(addPerson(invalidPerson)).rejects.toThrow()
      expect(post).not.toHaveBeenCalled()
    })
  })

  describe('getPersonAndDogs', () => {
    test('getPersonAndDogs calls endpoint', async () => {
      get.mockResolvedValue({ payload: {} })
      await getPersonAndDogs('P-123')
      expect(get).toHaveBeenCalledWith('person/P-123?includeDogs=true', expect.anything())
    })
  })

  describe('getPersonByReference', () => {
    test('getPersonByReference calls endpoint', async () => {
      get.mockResolvedValue({ payload: {} })
      await getPersonByReference('P-123')
      expect(get).toHaveBeenCalledWith('person/P-123')
    })
  })

  describe('updatePerson', () => {
    test('updatePerson calls endpoint', async () => {
      put.mockResolvedValue({ payload: {} })
      await updatePerson({ personReference: 'P-123' }, user)
      expect(put).toHaveBeenCalledWith('person', { personReference: 'P-123' }, expect.anything())
    })
  })
})
