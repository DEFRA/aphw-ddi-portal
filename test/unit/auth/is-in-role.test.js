const isInRole = require('../../../app/auth/is-in-role')
const ROLE_1 = 'role1'
const ROLE_2 = 'role2'
const ROLE_3 = 'role3'
let credentials

describe('is in role', () => {
  beforeEach(() => {
    credentials = {
      scope: [ROLE_1, ROLE_2]
    }
  })

  test('should return true if in role', () => {
    const result = isInRole(credentials, ROLE_1)
    expect(result).toBeTruthy()
  })

  test('should return false if not in role', () => {
    const result = isInRole(credentials, ROLE_3)
    expect(result).not.toBeTruthy()
  })

  test('should return false if no roles', () => {
    credentials.scope = []
    const result = isInRole(credentials, ROLE_3)
    expect(result).not.toBeTruthy()
  })

  test('should return false if no scope', () => {
    delete credentials.scope
    const result = isInRole(credentials, ROLE_3)
    expect(result).not.toBeTruthy()
  })

  test('should return false if credentials null', () => {
    const result = isInRole(null, ROLE_3)
    expect(result).not.toBeTruthy()
  })

  test('should return false if credentials undefined', () => {
    const result = isInRole(undefined, ROLE_3)
    expect(result).not.toBeTruthy()
  })
})
