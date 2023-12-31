const { addPerson, getPersonAndDogs } = require('../../../../app/api/ddi-index-api/person')
const { get, post } = require('../../../../app/api/ddi-index-api/base')
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

  test('getPersonAndDogs calls endpoint', async () => {
    get.mockResolvedValue({ payload: {} })
    await getPersonAndDogs('P-123')
    expect(get).toHaveBeenCalledWith('person/P-123?includeDogs=true', expect.anything())
  })
})
