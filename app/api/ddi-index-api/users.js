const { get, boomRequest, callDelete, post } = require('./base')
const { ApiErrorFailure } = require('../../errors/api-error-failure')
const { ApiConflictError } = require('../../errors/api-conflict-error')

const userEndpoint = 'user'
const usersEndpoint = 'users'

/**
 * @param user
 * @return {Promise<*>}
 */
const getUsers = async (user) => {
  const payload = await get(usersEndpoint, user)

  return payload.users.map(user => {
    delete user.active

    return user
  })
}

const addUser = async (username, callingUser) => {
  try {
    const payload = await post(userEndpoint, username, callingUser)
    return payload.username
  } catch (e) {
    if (e.isBoom && e.output.statusCode === 409) {
      throw new ApiConflictError({
        ...e,
        message: 'This user is already in the allow list'
      })
    }
    throw e
  }
}

const addUsers = async (usersDto, user) => {
  const mappedUsers = {
    users: usersDto.map(username => ({
      username
    }))
  }

  const mapUsersToUsernames = user => user.username

  const res = await boomRequest(usersEndpoint, 'POST', mappedUsers, user, false)

  const failures = res.payload.errors?.map(mapUsersToUsernames)
  const responseData = {
    users: {
      success: res.payload.users.map(mapUsersToUsernames),
      failures
    }
  }

  if (res.payload.users.length) {
    return responseData
  }

  if (res.statusCode.toString() === '409') {
    throw new ApiConflictError(new ApiErrorFailure('This user is already in the allow list', responseData))
  }
  throw new ApiErrorFailure(`${res.statusCode} ${res.statusMessage}`, responseData)
}

const removeUser = async (username, user) => {
  await callDelete(`${userEndpoint}/${username}`, user)
}

module.exports = {
  getUsers,
  addUsers,
  addUser,
  removeUser
}
