const { updateStatus, getDogDetails, updateDogDetails } = require('../../../../app/api/ddi-index-api/dog')
const { get, post, put } = require('../../../../app/api/ddi-index-api/base')
jest.mock('../../../../app/api/ddi-index-api/base')

const validDog = {
  dog: {
    name: 'Bruno',
    id: 123
  }
}

const validUpdateStatusPayload = {
  indexNumber: 'ED123',
  newStatus: 'Exempt'
}

describe('Dog test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('updateStatus calls post with valid payload', async () => {
    put.mockResolvedValue(123)
    get.mockResolvedValue(validDog)
    const res = await updateStatus(validUpdateStatusPayload)
    expect(res).not.toBe(null)
    expect(res).toBe(123)
    expect(put).toHaveBeenCalledWith('dog', { name: 'Bruno', id: 123, dogId: 123, status: 'Exempt' })
  })

  test('updateStatus doesnt call put with invalid payload', async () => {
    post.mockResolvedValue()
    await expect(updateStatus({})).rejects.toThrow()
    expect(put).not.toHaveBeenCalled()
  })

  test('getDogDetails calls endpoint', async () => {
    get.mockResolvedValue({ payload: {} })
    await getDogDetails('ED12345')
    expect(get).toHaveBeenCalledWith('dog/ED12345', expect.anything())
  })

  test('updateDogDetails calls endpoint', async () => {
    put.mockResolvedValue(123)
    await updateDogDetails({ id: 123 })
    expect(put).toHaveBeenCalledWith('dog', { id: 123, dogId: 123 })
  })
})
