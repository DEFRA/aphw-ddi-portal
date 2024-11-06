const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Country changed info', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/session/session-wrapper')
  const { setInSession, getFromSession } = require('../../../../../../app/session/session-wrapper')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  describe('GET /cdo/edit/country-changed-info', () => {
    test('route returns 200', async () => {
      const options = {
        method: 'GET',
        url: '/cdo/edit/country-changed-info',
        auth
      }

      const response = await server.inject(options)
      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelector('h1').textContent.trim()).toBe('Update the dog status')
      expect(document.querySelectorAll('form p.govuk-body')[0].textContent.trim()).toBe('As the owner has moved country, existing exemptions are no longer valid.')

      expect(response.statusCode).toBe(200)
    })

    test('returns 302 when no auth', async () => {
      const options = {
        method: 'GET',
        url: '/cdo/edit/country-changed-info'
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/login')
    })
  })

  describe('POST /cdo/edit/country-changed-info', () => {
    test('route returns 302 when all ok', async () => {
      getFromSession.mockReturnValue('/cdo/view/owner/return-point')

      const payload = {}

      const options = {
        method: 'POST',
        url: '/cdo/edit/country-changed-info',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/cdo/view/owner/return-point')
    })

    test('route returns 302 /login when no auth', async () => {
      setInSession.mockReturnValue()

      const options = {
        method: 'POST',
        url: '/cdo/edit/country-changed-info'
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/login')
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
