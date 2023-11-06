const mapAuth = require('../../../app/auth/map-auth')
const { admin } = require('../../../app/auth/permissions')
let request

describe('is in role', () => {
  beforeEach(() => {
    request = {
      auth: {
        isAuthenticated: true,
        credentials: {
          scope: []
        }
      }
    }
  })

  test('should return isAuthenticated if authenticated', () => {
    const result = mapAuth(request)
    expect(result.isAuthenticated).toBeTruthy()
  })

  test('should not return isAuthenticated if unauthenticated', () => {
    request.auth.isAuthenticated = false
    const result = mapAuth(request)
    expect(result.isAuthenticated).not.toBeTruthy()
  })

  test('should return isAnonymous if unauthenticated', () => {
    request.auth.isAuthenticated = false
    const result = mapAuth(request)
    expect(result.isAnonymous).toBeTruthy()
  })

  test('should not return isAnonymous if authenticated', () => {
    const result = mapAuth(request)
    expect(result.isAnonymous).not.toBeTruthy()
  })

  test('should not return isAdmin if no roles', () => {
    const result = mapAuth(request)
    expect(result.isAdminUser).not.toBeTruthy()
  })

  test('should return isLedgerUser if in role', () => {
    request.auth.credentials.scope = [admin]
    const result = mapAuth(request)
    expect(result.isAdminUser).toBeTruthy()
  })
})
