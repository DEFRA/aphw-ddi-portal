const { get, post, callDelete } = require('../ddi-events-api/base')
const createUserSchema = require('../../schema/ddi-events-api/users/create')
const { NotAuthorizedError } = require('../../errors/notAuthorizedError')
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

  const response = await post('users', value, actioningUser)
  return response.payload
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
