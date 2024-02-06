const getUser = require('../../../app/auth/get-user')
const MOCK_HOME_ACCOUNT_ID = 'mock-home-account-id'
const MOCK_NAME = 'mock-name'
const MOCK_USERNAME = 'mock-username'
let request

describe('is in role', () => {
  beforeEach(() => {
    request = {
      auth: {
        credentials: {
          account: {
            homeAccountId: MOCK_HOME_ACCOUNT_ID,
            name: MOCK_NAME,
            username: MOCK_USERNAME
          }
        }
      }
    }
  })

  test('should return homeAccountId as userId', () => {
    const result = getUser(request)
    expect(result.userId).toBe(MOCK_HOME_ACCOUNT_ID)
  })

  test('should return account name as displayname', () => {
    const result = getUser(request)
    expect(result.displayname).toBe(MOCK_NAME)
  })

  test('should return account username as username', () => {
    const result = getUser(request)
    expect(result.username).toBe(MOCK_USERNAME)
  })
})
