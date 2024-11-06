const { auth, user, standardAuth } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Audit query details route', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/session/session-wrapper')
  const { setInSession, getFromSession } = require('../../../../../../app/session/session-wrapper')

  jest.mock('../../../../../../app/api/ddi-events-api/external-event')
  const { getExternalEvents } = require('../../../../../../app/api/ddi-events-api/external-event')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    setInSession.mockReturnValue()
    getExternalEvents.mockResolvedValue()

    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
    jest.clearAllMocks()
  })

  describe('GET /admin/audit-audit-query-details', () => {
    test('returns a 200', async () => {
      getFromSession.mockReturnValue({ queryType: 'search' })
      const options = {
        method: 'GET',
        url: '/admin/audit/audit-query-details',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('Search terms used')
    })

    test('returns a 200 and handles date components', async () => {
      getFromSession.mockReturnValue({ queryType: 'search', fromDate: new Date(2024, 5, 7), toDate: new Date(2024, 8, 9), search_pk: 'previous terms' })
      const options = {
        method: 'GET',
        url: '/admin/audit/audit-query-details',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('Search terms used')
      expect(document.querySelector('#pk').value).toBe('previous terms')
      expect(document.querySelector('#fromDate-month').value.trim()).toBe('6')
      expect(document.querySelector('#fromDate-year').value.trim()).toBe('2024')
      expect(document.querySelector('#toDate-month').value.trim()).toBe('9')
      expect(document.querySelector('#toDate-year').value.trim()).toBe('2024')
    })

    test('returns 403 given user is standard user', async () => {
      const options = {
        method: 'GET',
        url: '/admin/audit/audit-query-details',
        auth: standardAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(403)
    })

    test('POST /admin/audit/audit-query-details returns 400 with empty payload', async () => {
      getFromSession.mockReturnValue({ queryType: 'search' })
      const options = {
        method: 'POST',
        url: '/admin/audit/audit-query-details',
        auth,
        payload: { queryType: 'search' }
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('Search terms used')
      expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('Enter a value')
    })

    test('POST /admin/audit/audit-query-details forwards to same screen with valid payload', async () => {
      getFromSession.mockReturnValue({ queryType: 'user' })
      const today = new Date()
      const options = {
        method: 'POST',
        url: '/admin/audit/audit-query-details',
        auth,
        payload: {
          queryType: 'user',
          pk: 'testuser@here.com',
          'fromDate-year': '2024',
          'fromDate-month': '3',
          'fromDate-day': '10',
          'toDate-year': `${today.getUTCFullYear()}`,
          'toDate-month': `${today.getUTCMonth() + 1}`,
          'toDate-day': `${today.getUTCDate()}`
        }
      }

      const thisEvening = new Date(today)
      thisEvening.setUTCHours(23)
      thisEvening.setUTCMinutes(59)
      thisEvening.setUTCSeconds(59)
      thisEvening.setUTCMilliseconds(0)

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/admin/audit/audit-query-details')
      expect(getExternalEvents).toHaveBeenCalledWith(`?queryType=user&pks=testuser@here.com&fromDate=2024-03-10T00:00:00.000Z&toDate=${thisEvening.toISOString()}`, user)
    })

    test('POST /admin/audit/audit-query-details handles query where no pk required', async () => {
      getFromSession.mockReturnValue({ queryType: 'date' })
      const today = new Date()
      const options = {
        method: 'POST',
        url: '/admin/audit/audit-query-details',
        auth,
        payload: {
          queryType: 'date'
        }
      }

      const thisEvening = new Date(today)
      thisEvening.setUTCHours(23)
      thisEvening.setUTCMinutes(59)
      thisEvening.setUTCSeconds(59)
      thisEvening.setUTCMilliseconds(0)

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/admin/audit/audit-query-details')
      expect(getExternalEvents).toHaveBeenCalledWith('?queryType=date&pks=dummy', user)
    })
  })
})
