const { extractBackNavParam } = require('../../../app/lib/back-helpers')
const { getFromSession } = require('../../../app/session/session-wrapper')
jest.mock('../../../app/session/session-wrapper')

describe('BackHelpers', () => {
  test('extractBackNavParam handles null referer', () => {
    const backNav = extractBackNavParam(null)
    expect(backNav).toBe('')
  })

  test('extractBackNavParam handles src', () => {
    getFromSession.mockReturnValue('https://testhost.com/somepage1?src=45678')
    const backNav = extractBackNavParam({ headers: { referer: 'https://testhost.com/somepage2?src=12345' } })
    expect(backNav).toBe('?src=45678')
  })
})
