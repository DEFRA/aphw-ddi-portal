const createUserSchema = require('../../schema/ddi-events-api/users/create')
const { NotAuthorizedError } = require('../../errors/notAuthorizedError')
const { postWithBoom, get, callDelete } = require('./base')
const { ApiErrorFailure } = require('../../errors/apiErrorFailure')
const { ApiConflictError } = require('../../errors/apiConflictError')
/**
 * @typedef {{username: string}} ActioningUser
 */
/**
 * @typedef {{pseudonym: string, rowKey: string, username: string}} MappedUser
 */
/**
 * @param {ActioningUser} actioningUser
 * @returns {Promise<MappedUser[]>}
 */
const getUsers = async (actioningUser) => {
  if (actioningUser === undefined) {
    throw new NotAuthorizedError('Admin user required for this action')
  }
  const response = await get('users', actioningUser)
  return response.users
}

/**
 * @param {{pseudonym: string, username: string}} newUser
 * @param {ActioningUser} actioningUser
 * @returns {Promise<MappedUser>}
 */
const createUser = async (newUser, actioningUser) => {
  if (actioningUser === undefined) {
    throw new Error('Admin user required for this action')
  }
  const { value, error } = createUserSchema.validate(newUser)

  if (error) {
    throw error
  }

  try {
    const response = await postWithBoom('users', value, actioningUser)
    return response.payload
  } catch (e) {
    if (e instanceof ApiErrorFailure) {
      if (e.boom.statusCode === 409) {
        throw new ApiConflictError(e)
      }
    }
    throw e
  }
}

/**
 * @param {string} username
 * @param {ActioningUser} actioningUser
 * @returns {Promise<void>}
 */
const deleteUser = async (username, actioningUser) => {
  await callDelete(`users/${username}`, actioningUser)
}

module.exports = {
  getUsers,
  createUser,
  deleteUser
}
