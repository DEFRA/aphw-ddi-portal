const { getUsers, createUser, deleteUser } = require('../../../../app/api/ddi-events-api/users')
const { user: adminUser } = require('../../../mocks/auth')

jest.mock('../../../../app/api/ddi-events-api/base')
const { get, post, callDelete } = require('../../../../app/api/ddi-events-api/base')
const { NotAuthorizedError } = require('../../../../app/errors/notAuthorizedError')

describe('users test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('getUsers calls endpoint', async () => {
    get.mockResolvedValue({
      users: [
        {
          username: 'internal-user',
          pseudonym: 'Hal',
          rowKey: '6917e9f6-a921-47b8-a0a0-d2851ce8b944'
        }
      ]
    })
    const users = await getUsers(adminUser)
    expect(get).toHaveBeenCalledWith('users', adminUser)
    expect(users[0]).toEqual({
      username: 'internal-user',
      pseudonym: 'Hal',
      rowKey: '6917e9f6-a921-47b8-a0a0-d2851ce8b944'
    })
  })

  test('getUsers should not call endpoint given actioning user is not included', async () => {
    await expect(getUsers()).rejects.toThrow(NotAuthorizedError)
    expect(get).not.toHaveBeenCalled()
  })

  test('createUser creates a user', async () => {
    post.mockResolvedValue({ payload: { username: 'Joel.Murphy78', pseudonym: 'Tavares', rowKey: '1' } })
    const newUser = {
      username: 'Joel.Murphy78',
      pseudonym: 'Tavares'
    }

    const user = await createUser(newUser, adminUser)
    expect(post).toBeCalledWith('users', newUser, adminUser)
    expect(user).toEqual({ username: 'Joel.Murphy78', pseudonym: 'Tavares', rowKey: '1' })
  })

  test('createUser with invalid payload should not post to API', async () => {
    await expect(createUser({ username: 'user.name' })).rejects.toThrow()
    expect(post).not.toHaveBeenCalled()
  })

  test('createUser without a user should not post to API', async () => {
    await expect(createUser({ username: 'Joel.Murphy78', pseudonym: 'Tavares' })).rejects.toThrow()
    expect(post).not.toHaveBeenCalled()
  })

  test('should deleteUser deletes a user', async () => {
    await deleteUser('user@example.com', adminUser)
    expect(callDelete).toBeCalledWith('users/user@example.com', adminUser)
  })

  test('should deleteUser should not delete a user if no actioning user sent', async () => {
    callDelete.mockRejectedValue(new NotAuthorizedError('not authorized'))
    await expect(deleteUser('user@example.com')).rejects.toThrow(new NotAuthorizedError('not authorized'))
  })
})
