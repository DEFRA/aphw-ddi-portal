jest.mock('../../../../app/api/ddi-index-api/base')
const { get, boomRequest, callDelete, post } = require('../../../../app/api/ddi-index-api/base')

const { addUser, getUsers, addUsers, removeUser } = require('../../../../app/api/ddi-index-api/users')
const { user } = require('../../../mocks/auth')
const { ApiConflictError } = require('../../../../app/errors/api-conflict-error')
const { afterEach } = require('node:test')
const { ApiErrorFailure } = require('../../../../app/errors/api-error-failure')
const { buildUser } = require('../../../mocks/users')
const { sort } = require('../../../../app/constants/api')

describe('DDI API users', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('addUser', () => {
    test('should add user if no issues', async () => {
      post.mockResolvedValue({
        id: 1,
        username: 'ralph@wreckit.com',
        active: true
      })

      const userDto = 'ralph@wreckit.com'

      const addedUser = await addUser(userDto, user)
      expect(addedUser).toEqual('ralph@wreckit.com')
      expect(post).toHaveBeenCalledWith('user', userDto, user)
    })

    test('should fail with an ApiConflictError if result was a 500', async () => {
      post.mockRejectedValue(new Error('This user is already in the allow list'))

      const userDto = 'ralph@wreckit.com'

      await expect(addUser(userDto, user)).rejects.toThrowError(new ApiConflictError({
        message: 'This user is already in the allow list'
      }))
    })

    test('should fail with an ApiConflictError if result was a 409', async () => {
      post.mockRejectedValue({
        isBoom: true,
        output: {
          statusCode: 409
        }
      })

      const userDto = 'ralph@wreckit.com'

      await expect(addUser(userDto, user)).rejects.toThrowError(new ApiConflictError({
        message: 'This user is already in the allow list'
      }))
    })
  })

  describe('addUsers', () => {
    test('should add users if no issues', async () => {
      boomRequest.mockResolvedValue({
        statusCode: 200,
        statusMessage: 'ok',
        payload: {
          users: [
            {
              id: 1,
              username: 'ralph@wreckit.com',
              active: true
            },
            {
              id: 2,
              police_force_id: 57,
              username: 'scott.turner@sacramento.police.gov',
              active: true
            },
            {
              id: 3,
              police_force_id: 1,
              username: 'axel.foley@beverly-hills.police.gov',
              active: true
            }
          ]
        }
      })

      const usersDto = [
        'ralph@wreckit.com',
        'scott.turner@sacramento.police.gov',
        'axel.foley@beverly-hills.police.gov'
      ]
      const addedUsers = await addUsers(usersDto, user)
      expect(addedUsers).toEqual({
        users: {
          success: [
            'ralph@wreckit.com',
            'scott.turner@sacramento.police.gov',
            'axel.foley@beverly-hills.police.gov'
          ]
        }
      })
      expect(boomRequest).toHaveBeenCalledWith(
        'users',
        'POST', {
          users: [
            {
              username: 'ralph@wreckit.com'
            },
            {
              username: 'scott.turner@sacramento.police.gov'
            },
            {
              username: 'axel.foley@beverly-hills.police.gov'
            }
          ]
        }, user, false)
    })

    test('should add users if some successes', async () => {
      boomRequest.mockResolvedValue({
        statusCode: 400,
        statusMessage: 'ok',
        payload: {
          users: [
            {
              id: 1,
              username: 'ralph@wreckit.com',
              active: true
            },
            {
              id: 2,
              police_force_id: 57,
              username: 'scott.turner@sacramento.police.gov',
              active: true
            },
            {
              id: 3,
              police_force_id: 1,
              username: 'axel.foley@beverly-hills.police.gov',
              active: true
            }
          ],
          errors: [
            {
              statusCode: 409,
              error: 'Conflict',
              message: 'This user is already in the allow list',
              username: 'alex.murphy@ocp.police.gov'
            },
            {
              statusCode: 409,
              error: 'Conflict',
              message: 'This user is already in the allow list',
              username: 'harry.callahan@san-francisco.police.gov'
            }
          ]
        }
      })

      const usersDto = [
        'ralph@wreckit.com',
        'scott.turner@sacramento.police.gov',
        'axel.foley@beverly-hills.police.gov',
        'alex.murphy@ocp.police.gov',
        'harry.callahan@san-francisco.police.gov'
      ]
      const addedUsers = await addUsers(usersDto, user)
      expect(addedUsers).toEqual({
        users: {
          success: [
            'ralph@wreckit.com',
            'scott.turner@sacramento.police.gov',
            'axel.foley@beverly-hills.police.gov'
          ],
          failures: [
            'alex.murphy@ocp.police.gov',
            'harry.callahan@san-francisco.police.gov'
          ]
        }
      })
      expect(boomRequest).toHaveBeenCalledWith(
        'users',
        'POST', {
          users: [
            {
              username: 'ralph@wreckit.com'
            },
            {
              username: 'scott.turner@sacramento.police.gov'
            },
            {
              username: 'axel.foley@beverly-hills.police.gov'
            },
            {
              username: 'alex.murphy@ocp.police.gov'
            },
            {
              username: 'harry.callahan@san-francisco.police.gov'
            }
          ]
        }, user, false)
    })

    test('should fail with a 409 if all users were conflicts', async () => {
      boomRequest.mockResolvedValue({
        statusCode: 409,
        statusMessage: 'Conflict',
        payload: {
          users: [],
          errors: [
            {
              statusCode: 409,
              error: 'Conflict',
              message: 'This user is already in the allow list',
              username: 'alex.murphy@ocp.police.gov'
            },
            {
              statusCode: 409,
              error: 'Conflict',
              message: 'This user is already in the allow list',
              username: 'harry.callahan@san-francisco.police.gov'
            }
          ]
        }
      })

      const usersDto = [
        'alex.murphy@ocp.police.gov',
        'harry.callahan@san-francisco.police.gov'
      ]

      await expect(addUsers(usersDto, user)).rejects.toThrowError(new ApiConflictError({
        message: 'This user is already in the allow list'
      }))

      expect(boomRequest).toHaveBeenCalledWith(
        'users',
        'POST', {
          users: [
            {
              username: 'alex.murphy@ocp.police.gov'
            },
            {
              username: 'harry.callahan@san-francisco.police.gov'
            }
          ]
        }, user, false)
    })

    test('should fail with a 500 if all users were conflicts', async () => {
      const responseData = {
        statusCode: 500,
        statusMessage: 'error',
        payload: {
          users: [],
          errors: [
            {
              statusCode: 500,
              error: 'error',
              message: 'error',
              username: 'alex.murphy@ocp.police.gov'
            }
          ]
        }
      }
      boomRequest.mockResolvedValue(responseData)

      const usersDto = [
        'alex.murphy@ocp.police.gov'
      ]

      await expect(addUsers(usersDto, user)).rejects.toThrowError(new ApiErrorFailure('500 error', {
        message: 'This user is already in the allow list'
      }))

      expect(boomRequest).toHaveBeenCalledWith(
        'users',
        'POST', {
          users: [
            {
              username: 'alex.murphy@ocp.police.gov'
            }
          ]
        }, user, false)
    })
  })

  describe('getUsers', () => {
    const usersResponse = {
      users: [
        buildUser({
          id: 1,
          username: 'ralph@wreckit.com',
          active: true
        }),
        buildUser({
          id: 2,
          police_force_id: 57,
          username: 'scott.turner@sacramento.police.gov',
          active: true
        }),
        buildUser({
          id: 3,
          police_force_id: 1,
          username: 'axel.foley@beverly-hills.police.gov',
          active: true
        })
      ],
      count: 3
    }
    test('should return a list of users', async () => {
      get.mockResolvedValue(usersResponse)

      const { users, count } = await getUsers({}, user)
      expect(users).toBeInstanceOf(Array)
      expect(count).toBe(3)
      expect(users).toEqual(usersResponse.users)
      expect(get).toHaveBeenCalledWith(expect.objectContaining({ href: 'http://localhost/users' }), user)
    })

    test('should return a list of users filtered by police force', async () => {
      get.mockResolvedValue(usersResponse)

      await getUsers({ filter: { policeForceId: 2 } }, user)

      expect(get).toHaveBeenCalledWith(expect.objectContaining({ href: 'http://localhost/users?policeForceId=2' }), user)
    })

    test('should return a list of users filtered by police force', async () => {
      get.mockResolvedValue(usersResponse)

      await getUsers({ filter: { policeForceId: undefined } }, user)

      expect(get).toHaveBeenCalledWith(expect.objectContaining({ href: 'http://localhost/users' }), user)
    })

    test('should return a list of users sorted by police force ASC', async () => {
      get.mockResolvedValue(usersResponse)

      await getUsers({ sort: { policeForce: sort.ASC } }, user)

      expect(get).toHaveBeenCalledWith(expect.objectContaining({ href: 'http://localhost/users?sortKey=policeForce&sortOrder=ASC' }), user)
    })

    test('should return a list of users sorted by police force DESC', async () => {
      get.mockResolvedValue(usersResponse)

      await getUsers({ sort: { policeForce: sort.DESC } }, user)

      expect(get).toHaveBeenCalledWith(expect.objectContaining({ href: 'http://localhost/users?sortKey=policeForce&sortOrder=DESC' }), user)
    })

    test('should return a list of users sorted by username ASC', async () => {
      get.mockResolvedValue(usersResponse)

      await getUsers({ sort: { username: sort.ASC } }, user)

      expect(get).toHaveBeenCalledWith(expect.objectContaining({ href: 'http://localhost/users?sortKey=username&sortOrder=ASC' }), user)
    })

    test('should return a list of users sorted by indexAccess Yes', async () => {
      get.mockResolvedValue(usersResponse)

      await getUsers({ sort: { indexAccess: true } }, user)

      expect(get).toHaveBeenCalledWith(expect.objectContaining({ href: 'http://localhost/users?sortKey=activated&activated=Y' }), user)
    })

    test('should return a list of users sorted by indexAccess No', async () => {
      get.mockResolvedValue(usersResponse)

      await getUsers({ sort: { indexAccess: false } }, user)

      expect(get).toHaveBeenCalledWith(expect.objectContaining({ href: 'http://localhost/users?sortKey=activated&activated=N' }), user)
    })

    test('should return a list of users called with multiple options', async () => {
      get.mockResolvedValue(usersResponse)

      await getUsers({ filter: { policeForceId: 2 }, sort: { username: sort.DESC } }, user)

      expect(get).toHaveBeenCalledWith(expect.objectContaining({ href: 'http://localhost/users?policeForceId=2&sortKey=username&sortOrder=DESC' }), user)
    })
  })

  describe('removeUser', () => {
    test('should delete a user', async () => {
      const callingUser = user
      const username = 'ralph@wreckit.com'
      await removeUser(username, callingUser)

      expect(callDelete).toHaveBeenCalledWith('user/ralph@wreckit.com', callingUser)
    })
  })
})
