const config = require('../config')
const msal = require('@azure/msal-node')

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
  const authCodeUrlParameters = {
    prompt: 'select_account', // Force the MS account select dialog
    redirectUri: config.authConfig.redirectUrl
  }
  const authUrl = await msalClientApplication.getAuthCodeUrl(authCodeUrlParameters)
  return authUrl
}

const authenticate = async (redirectCode, cookieAuth) => {
  const token = await msalClientApplication.acquireTokenByCode({
    code: redirectCode,
    redirectUri: config.authConfig.redirectUrl
  })

  cookieAuth.set({
    scope: token.idTokenClaims.roles,
    account: token.account
  })
}

const refresh = async (account, cookieAuth, forceRefresh = true) => {
  const token = await msalClientApplication.acquireTokenSilent({
    account,
    forceRefresh
  })

  cookieAuth.set({
    scope: token.idTokenClaims.roles,
    account: token.account
  })
  return token.idTokenClaims.roles
}

const logout = async (account) => {
  try {
    await msalClientApplication.getTokenCache().removeAccount(account)
  } catch (err) {
    console.error('Unable to end session', err)
  }
}

module.exports = {
  getAuthenticationUrl,
  authenticate,
  refresh,
  logout
}
