const config = require('../config')
const msal = require('@azure/msal-node')

console.log('~~~~~~ Chris Debug ~~~~~~ azure auth init', '')
/* istanbul ignore next */
const msalLogging = config.isProd
  ? {} // NOSONAR
  : {
      /* istanbul ignore next */
      loggerCallback (loglevel, message, containsPii) {
        console.log(message)
      }, // NOSONAR
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Verbose
    }

const msalClientApplication = new msal.ConfidentialClientApplication({
  auth: config.authConfig.azure,
  system: { loggerOptions: msalLogging }
})

const getAuthenticationUrl = async () => {
  console.log('~~~~~~ Chris Debug ~~~~~~ getAuthenticationUrl', '')
  const authCodeUrlParameters = {
    prompt: 'select_account', // Force the MS account select dialog
    redirectUri: config.authConfig.redirectUrl
  }
  console.log('~~~~~~ Chris Debug ~~~~~~ getAuthenticationUrl 2', '')
  const authUrl = await msalClientApplication.getAuthCodeUrl(authCodeUrlParameters)
  console.log('~~~~~~ Chris Debug ~~~~~~ getAuthenticationUrl 3', '')
  return authUrl
}

const authenticate = async (redirectCode, cookieAuth) => {
  console.log('~~~~~~ Chris Debug ~~~~~~ authenticate', '')
  const token = await msalClientApplication.acquireTokenByCode({
    code: redirectCode,
    redirectUri: config.authConfig.redirectUrl
  })
  console.log('~~~~~~ Chris Debug ~~~~~~ authenticate token', 'Token', token)

  cookieAuth.set({
    scope: token.idTokenClaims.roles,
    account: token.account
  })
  console.log('~~~~~~ Chris Debug ~~~~~~ authenticate cookieAuthset', '')
}

const refresh = async (account, cookieAuth, forceRefresh = true) => {
  console.log('~~~~~~ Chris Debug ~~~~~~ refresh', 'CookieAuth', cookieAuth)
  const token = await msalClientApplication.acquireTokenSilent({
    account,
    forceRefresh
  })
  console.log('~~~~~~ Chris Debug ~~~~~~ refresh', 'Token', token)

  cookieAuth.set({
    scope: token.idTokenClaims.roles,
    account: token.account
  })
  console.log('~~~~~~ Chris Debug ~~~~~~ refresh', 'CookieAuth', cookieAuth)
  console.log('~~~~~~ Chris Debug ~~~~~~ refresh', 'Token.idTokenClaims.roles', token.idTokenClaims.roles)
  return token.idTokenClaims.roles
}

const logout = async (account) => {
  try {
    await msalClientApplication.getTokenCache().removeAccount(account)
  } catch (err) {
    console.error('Unable to end session', err)
  }
}

console.log('~~~~~~ Chris Debug ~~~~~~ azure auth load complete', '')

module.exports = {
  getAuthenticationUrl,
  authenticate,
  refresh,
  logout
}
