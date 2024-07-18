const { addBackNavigation, extractBackNavParam, addBackNavigationForErrorCondition, extractSrcParamFromUrl, getBackLinkToSamePage, forceToHttps } = require('../../../app/lib/back-helpers')
const { getFromSession, setInSession } = require('../../../app/session/session-wrapper')
jest.mock('../../../app/session/session-wrapper')

jest.mock('uuid')
const { v4: uuidv4 } = require('uuid')

describe('BackHelpers', () => {
  beforeEach(() => {
    uuidv4.mockReturnValue('729b8f6f-e744-42dd-ae97-247eed9fe61c')
  })

  describe('extractBackNavParam', () => {
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
  })

  describe('addBackNavForErrorCondition', () => {
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

  describe('getBackLinkToSamePage', () => {
    test('should return back navigation from same page', () => {
      const request = {
        headers: {
          referer: 'https://testhost.com/somepage2?src=12346'
        }
      }
      const backNavigation = getBackLinkToSamePage(request)
      expect(backNavigation).toEqual('https://testhost.com/somepage2?src=12346')
    })

    test('should return back navigation from same page', () => {
      const request = {
        headers: undefined
      }
      const backNavigation = getBackLinkToSamePage(request)
      expect(backNavigation).toEqual('')
    })
  })

  describe('extractSrcParamFromUrl', () => {
    test('extractSrcParamFromUrl handles strip false', () => {
      const srcParam = extractSrcParamFromUrl('https://testhost.com/somepage2?src=12346', false)
      expect(srcParam).toBe('?src=12346')
    })

    test('extractSrcParamFromUrl handles strip true', () => {
      const srcParam = extractSrcParamFromUrl('https://testhost.com/somepage2?src=12347', true)
      expect(srcParam).toBe('12347')
    })

    test('extractSrcParamFromUrl handles strip true when no src', () => {
      const srcParam = extractSrcParamFromUrl('https://testhost.com/somepage2?res=12347', true)
      expect(srcParam).toBe('')
    })
  })

  describe('addBackNavigation', () => {
    test('addBackNavigation generates correct details', () => {
      getFromSession.mockReturnValue('https://testhost.com/prevpage?src=45678')
      setInSession.mockReturnValue()

      const backNav = addBackNavigation({ url: { href: 'https://testhost.com/newpage' }, headers: { referer: 'https://testhost.com/differentpage?src=789' } })

      expect(backNav.backLink).toBe('https://testhost.com/prevpage?src=45678')
      expect(backNav.srcHashParam).toBe('?src=729b-8f6f')
      expect(backNav.srcHashValue).toBe('729b-8f6f')
      expect(backNav.currentHashParam).toBe('789')
    })
  })

  describe('addBackNavForErrorCondition', () => {
    test('addBackNavForErrorCondition handles backlink when src param', () => {
      getFromSession.mockReturnValue('https://testhost.com/somepage1?src=45678')
      setInSession.mockReturnValue()

      const backNav = addBackNavigationForErrorCondition({ headers: { referer: 'https://testhost.com/somepage?src=888' } })

      expect(backNav.backLink).toBe('https://testhost.com/somepage1?src=45678')
      expect(backNav.srcHashParam).toBe('?src=https://testhost.com/somepage1?src=45678')
      expect(backNav.srcHashValue).toBe('https://testhost.com/somepage1?src=45678')
      expect(backNav.currentHashParam).toBe('?src=45678')
    })
  })

  describe('forceToHttps', () => {
    test('handles null', () => {
      const res = forceToHttps(null)
      expect(res).toBeNull()
    })

    test('leaves localhost as non-secure', () => {
      const res = forceToHttps('http://localhost:3000/123')
      expect(res).toBe('http://localhost:3000/123')
    })

    test('changes to secure', () => {
      const res = forceToHttps('http://some-cloud-host.com/my-page/ED123?src=abc123')
      expect(res).toBe('https://some-cloud-host.com/my-page/ED123?src=abc123')
    })
  })
})
