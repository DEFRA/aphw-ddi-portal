const { admin } = require('../../app/auth/permissions')

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

module.exports = {
  user,
  auth,
  userWithDisplayname
}
