const { admin } = require('./permissions')
const { v4: uuidv4 } = require('uuid')
const devAccount = require('./dev-account')

const getAuthenticationUrl = () => {
  return '/dev-auth'
}

const currentRole = admin // standard

const authenticate = async (redirectCode, cookieAuth) => {
  cookieAuth.set({
    scope: [currentRole],
    account: devAccount
  })
}

const refresh = async (account, cookieAuth, forceRefresh = true) => {
  cookieAuth.set({
    scope: [currentRole],
    account: devAccount
  })

  return [currentRole]
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
