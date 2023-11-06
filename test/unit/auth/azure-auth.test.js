const mockRoles = ['test-role']
const mockAccount = 'test-account'
const mockGetAuthCodeUrl = jest.fn()
const mockAcquireTokenByCode = jest.fn().mockImplementation(() => {
  return {
    idTokenClaims: {
      roles: mockRoles
    },
    account: mockAccount
  }
})
const mockAcquireTokenSilent = jest.fn().mockImplementation(() => {
  return {
    idTokenClaims: {
      roles: mockRoles
    },
    account: mockAccount
  }
})
const mockRemoveAccount = jest.fn()
const mockGetTokenCache = jest.fn().mockImplementation(() => {
  return {
    removeAccount: mockRemoveAccount
  }
})
jest.mock('@azure/msal-node', () => {
  return {
    ConfidentialClientApplication: jest.fn().mockImplementation(() => {
      return {
        getAuthCodeUrl: mockGetAuthCodeUrl,
        acquireTokenByCode: mockAcquireTokenByCode,
        acquireTokenSilent: mockAcquireTokenSilent,
        getTokenCache: mockGetTokenCache
      }
    }),
    LogLevel: {
      Verbose: 'verbose'
    }
  }
})
const azureAuth = require('../../../app/auth/azure-auth')
const { authConfig } = require('../../../app/config')
let mockCookieAuth

describe('azure authentication', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCookieAuth = {
      set: jest.fn()
    }
  })

  test('getAuthenticationUrl should call getAuthCodeUrl once', () => {
    azureAuth.getAuthenticationUrl()
    expect(mockGetAuthCodeUrl).toHaveBeenCalledTimes(1)
  })

  test('getAuthenticationUrl should call getAuthCodeUrl forcing account select prompt', () => {
    azureAuth.getAuthenticationUrl()
    expect(mockGetAuthCodeUrl.mock.calls[0][0].prompt).toBe('select_account')
  })

  test('getAuthenticationUrl should call getAuthCodeUrl with redirect url from config', () => {
    azureAuth.getAuthenticationUrl()
    expect(mockGetAuthCodeUrl.mock.calls[0][0].redirectUri).toBe(authConfig.redirectUrl)
  })

  test('authenticate should call acquireTokenByCode once', async () => {
    await azureAuth.authenticate('redirectCode', mockCookieAuth)
    expect(mockAcquireTokenByCode).toHaveBeenCalledTimes(1)
  })

  test('authenticate should call acquireTokenByCode with redirect code', async () => {
    await azureAuth.authenticate('redirectCode', mockCookieAuth)
    expect(mockAcquireTokenByCode.mock.calls[0][0].code).toBe('redirectCode')
  })

  test('authenticate should call acquireTokenByCode with redirect url from config', async () => {
    await azureAuth.authenticate('redirectCode', mockCookieAuth)
    expect(mockAcquireTokenByCode.mock.calls[0][0].redirectUri).toBe(authConfig.redirectUrl)
  })

  test('authenticate call cookieAuth.set once', async () => {
    await azureAuth.authenticate('redirectCode', mockCookieAuth)
    expect(mockCookieAuth.set).toHaveBeenCalledTimes(1)
  })

  test('authenticate should set scopes in cookieAuth', async () => {
    await azureAuth.authenticate('redirectCode', mockCookieAuth)
    expect(mockCookieAuth.set.mock.calls[0][0].scope).toBe(mockRoles)
  })

  test('authenticate should set account in cookieAuth', async () => {
    await azureAuth.authenticate('redirectCode', mockCookieAuth)
    expect(mockCookieAuth.set.mock.calls[0][0].account).toBe(mockAccount)
  })

  test('refresh should call acquireTokenSilent once', async () => {
    await azureAuth.refresh(mockAccount, mockCookieAuth)
    expect(mockAcquireTokenSilent).toHaveBeenCalledTimes(1)
  })

  test('refresh should call mockAcquireTokenSilent with account', async () => {
    await azureAuth.refresh(mockAccount, mockCookieAuth)
    expect(mockAcquireTokenSilent.mock.calls[0][0].account).toBe(mockAccount)
  })

  test('refresh should call mockAcquireTokenSilent with force refresh true when not provided', async () => {
    await azureAuth.refresh(mockAccount, mockCookieAuth)
    expect(mockAcquireTokenSilent.mock.calls[0][0].forceRefresh).toBeTruthy()
  })

  test('refresh should call mockAcquireTokenSilent with force refresh true when true', async () => {
    await azureAuth.refresh(mockAccount, mockCookieAuth, true)
    expect(mockAcquireTokenSilent.mock.calls[0][0].forceRefresh).toBeTruthy()
  })

  test('refresh should call mockAcquireTokenSilent with force refresh false when false', async () => {
    await azureAuth.refresh(mockAccount, mockCookieAuth, false)
    expect(mockAcquireTokenSilent.mock.calls[0][0].forceRefresh).not.toBeTruthy()
  })

  test('refresh should call cookieAuth.set once', async () => {
    await azureAuth.refresh(mockAccount, mockCookieAuth)
    expect(mockCookieAuth.set).toHaveBeenCalledTimes(1)
  })

  test('refresh should set scopes in cookieAuth', async () => {
    await azureAuth.refresh(mockAccount, mockCookieAuth)
    expect(mockCookieAuth.set.mock.calls[0][0].scope).toBe(mockRoles)
  })

  test('refresh should set account in cookieAuth', async () => {
    await azureAuth.refresh(mockAccount, mockCookieAuth)
    expect(mockCookieAuth.set.mock.calls[0][0].account).toBe(mockAccount)
  })

  test('refresh should return roles', async () => {
    const result = await azureAuth.refresh(mockAccount, mockCookieAuth)
    expect(result).toBe(mockRoles)
  })

  test('logout should call removeAccount once', async () => {
    await azureAuth.logout(mockAccount)
    expect(mockRemoveAccount).toHaveBeenCalledTimes(1)
  })

  test('logout should call removeAccount with account', async () => {
    await azureAuth.logout(mockAccount)
    expect(mockRemoveAccount).toHaveBeenCalledWith(mockAccount)
  })
})
