const { auth, user, standardAuth } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Audit query type route', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/session/session-wrapper')
  const { setInSession, getFromSession } = require('../../../../../../app/session/session-wrapper')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    setInSession.mockReturnValue()

    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
    jest.clearAllMocks()
  })

  describe('GET /admin/audit-audit-query-type', () => {
    test('returns a 200', async () => {
      getFromSession.mockReturnValue()
      const options = {
        method: 'GET',
        url: '/admin/audit/audit-query-type',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('h1.govuk-heading-l').textContent.trim()).toBe('Query the audit events of external users')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Continue')
    })

    test('returns 403 given user is standard user', async () => {
      const options = {
        method: 'GET',
        url: '/admin/audit/audit-query-type',
        auth: standardAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(403)
    })

    test('clears session values if param passed', async () => {
      getFromSession.mockReturnValue()
      const options = {
        method: 'GET',
        url: '/admin/audit/audit-query-type?clear=true',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(setInSession).toHaveBeenCalledWith(expect.anything(), 'auditQuery', null)
    })

    test('POST /admin/audit/audit-query-type returns 400 with empty payload', async () => {
      const options = {
        method: 'POST',
        url: '/admin/audit/audit-query-type',
        auth,
        payload: {}
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('h1.govuk-heading-l').textContent.trim()).toBe('Query the audit events of external users')
      expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('Select an option')
    })

    test('POST /admin/audit/audit-query-type forwards to next screen with valid payload', async () => {
      const options = {
        method: 'POST',
        url: '/admin/audit/audit-query-type',
        auth,
        payload: { queryType: 'date' }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/admin/audit/audit-query-details')
    })
  })
})
