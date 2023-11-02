const getUser = require('../../../app/auth/get-user')
const MOCK_HOME_ACCOUNT_ID = 'mock-home-account-id'
const MOCK_NAME = 'mock-name'
let request

describe('is in role', () => {
  beforeEach(() => {
    request = {
      auth: {
        credentials: {
          account: {
            homeAccountId: MOCK_HOME_ACCOUNT_ID,
            name: MOCK_NAME
          }
        }
      }
    }
  })

  test('should return homeAccountId as userId', () => {
    const result = getUser(request)
    expect(result.userId).toBe(MOCK_HOME_ACCOUNT_ID)
  })

  test('should return account name as username', () => {
    const result = getUser(request)
    expect(result.username).toBe(MOCK_NAME)
  })
})
