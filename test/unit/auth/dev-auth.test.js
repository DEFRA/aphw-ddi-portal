const devAuth = require('../../../app/auth/dev-auth')
const { admin } = require('../../../app/auth/permissions')
const devAccount = require('../../../app/auth/dev-account')
let mockCookieAuth

describe('dev authentication', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCookieAuth = {
      set: jest.fn()
    }
  })

  test('getAuthenticationUrl should return dev url', () => {
    const result = devAuth.getAuthenticationUrl()
    expect(result).toBe('/dev-auth')
  })

  test('authenticate call cookieAuth.set once', async () => {
    await devAuth.authenticate('redirectCode', mockCookieAuth)
    expect(mockCookieAuth.set).toHaveBeenCalledTimes(1)
  })

  test('authenticate should set scopes in cookieAuth', async () => {
    await devAuth.authenticate('redirectCode', mockCookieAuth)
    expect(mockCookieAuth.set.mock.calls[0][0].scope).toStrictEqual([admin])
  })

  test('authenticate should set account in cookieAuth', async () => {
    await devAuth.authenticate('redirectCode', mockCookieAuth)
    expect(mockCookieAuth.set.mock.calls[0][0].account).toBe(devAccount)
  })

  test('refresh should call cookieAuth.set once', async () => {
    await devAuth.refresh(devAccount, mockCookieAuth)
    expect(mockCookieAuth.set).toHaveBeenCalledTimes(1)
  })

  test('refresh should set scopes in cookieAuth', async () => {
    await devAuth.refresh(devAccount, mockCookieAuth)
    expect(mockCookieAuth.set.mock.calls[0][0].scope).toStrictEqual([admin])
  })

  test('refresh should set account in cookieAuth', async () => {
    await devAuth.refresh(devAccount, mockCookieAuth)
    expect(mockCookieAuth.set.mock.calls[0][0].account).toBe(devAccount)
  })

  test('refresh should return roles', async () => {
    const result = await devAuth.refresh(devAccount, mockCookieAuth)
    expect(result).toStrictEqual([admin])
  })

  test('logout should update homeAccountId', async () => {
    const originalHomeAccountId = devAccount.homeAccountId
    await devAuth.logout(devAccount)
    expect(devAccount.homeAccountId).not.toBe(originalHomeAccountId)
  })
})
