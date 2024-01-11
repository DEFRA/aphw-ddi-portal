const { extractBackNavParam, addBackNavigationForErrorCondition } = require('../../../app/lib/back-helpers')
const { getFromSession, setInSession } = require('../../../app/session/session-wrapper')
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

  test('extractBackNavParam handles src with removing prefix', () => {
    getFromSession.mockReturnValue('https://testhost.com/somepage1?src=45678')
    const backNav = extractBackNavParam({ headers: { referer: 'https://testhost.com/somepage2?src=12345' } }, true)
    expect(backNav).toBe('45678')
  })

  test('addBackNavForErrorCondition handles backlink', () => {
    getFromSession.mockReturnValue('https://testhost.com/somepage1?src=45678')
    setInSession.mockReturnValue()
    const backNav = addBackNavigationForErrorCondition({ headers: { referer: 'https://testhost.com/somepage2?src=12345' } })
    expect(backNav.backLink).toBe('https://testhost.com/somepage1?src=45678')
  })

  test('addBackNavForErrorCondition handles backlink when no src param', () => {
    getFromSession.mockReturnValue('https://testhost.com/somepage1?src=45678')
    setInSession.mockReturnValue()
    const backNav = addBackNavigationForErrorCondition({ headers: { referer: 'https://testhost.com/somepage-no-src-param' } })
    expect(backNav.backLink).toBe('https://testhost.com/somepage1?src=45678')
  })
})
