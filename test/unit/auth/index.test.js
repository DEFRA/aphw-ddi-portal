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

describe('azure authentication', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV } // Make a copy
  })

  afterAll(() => {
    process.env = OLD_ENV // Restore old environment
  })

  test('getAuthenticationUrl should call getAuthCodeUrl once', () => {
    process.env.AUTHENTICATION_ENABLED = 'true'

    jest.mock('../../../app/auth/azure-auth', () => ({
      getAuthenticationUrl: jest.fn()
    }))
    const { getAuthenticationUrl } = require('../../../app/auth/azure-auth')

    jest.mock('../../../app/auth/map-auth')
    jest.mock('../../../app/auth/get-user')

    const auth = require('../../../app/auth')
    auth.getAuthenticationUrl()
    expect(getAuthenticationUrl).toHaveBeenCalledTimes(1)
  })
})
