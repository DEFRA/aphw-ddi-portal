const { admin, standard } = require('../../app/auth/permissions')

const user = {
  userId: '1',
  username: 'test@example.com'
}

const userWithDisplayname = {
  userId: '1',
  username: 'test@example.com',
  displayname: 'Example Tester'
}

const auth = { strategy: 'session-auth', credentials: { scope: [admin], account: { user } } }

const standardAuth = { strategy: 'session-auth', credentials: { scope: [standard], account: { user } } }

module.exports = {
  user,
  auth,
  standardAuth,
  userWithDisplayname
}
