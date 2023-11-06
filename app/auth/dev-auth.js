const { admin } = require('./permissions')
const { v4: uuidv4 } = require('uuid')
const devAccount = require('./dev-account')

const getAuthenticationUrl = () => {
  return '/dev-auth'
}

const authenticate = async (redirectCode, cookieAuth) => {
  cookieAuth.set({
    scope: [admin],
    account: devAccount
  })
}

const refresh = async (account, cookieAuth, forceRefresh = true) => {
  cookieAuth.set({
    scope: [admin],
    account: devAccount
  })

  return [admin]
}

const logout = async (account) => {
  devAccount.homeAccountId = uuidv4()
}

module.exports = {
  getAuthenticationUrl,
  authenticate,
  refresh,
  logout
}
