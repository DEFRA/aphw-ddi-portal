const { admin, standard } = require('../../app/auth/permissions')

const user = {
  userId: '1',
  username: 'test@example.com'
}

const userForAuth = {
  username: 'test@example.com',
  name: 'Example Tester',
  homeAccountId: '1'
}

const userWithDisplayname = {
  userId: '1',
  username: 'test@example.com',
  displayname: 'Example Tester'
}

const auth = { strategy: 'session-auth', credentials: { scope: [admin], account: userForAuth } }

const standardAuth = { strategy: 'session-auth', credentials: { scope: [standard], account: userForAuth } }

const adminAuth = auth

module.exports = {
  auth,
  adminAuth,
  standardAuth,
  userWithDisplayname,
  user
}
