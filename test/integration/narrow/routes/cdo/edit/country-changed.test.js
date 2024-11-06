const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Country changed', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/session/session-wrapper')
  const { getFromSession, setInSession } = require('../../../../../../app/session/session-wrapper')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  describe('GET /cdo/edit/country-changed', () => {
    test('route returns 200', async () => {
      getFromSession.mockReturnValue({
        policeResult: { policeForceResult: { policeForceName: 'New force' } },
        country: 'England'
      })

      const options = {
        method: 'GET',
        url: '/cdo/edit/country-changed',
        auth
      }

      const response = await server.inject(options)
      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelector('h1').textContent.trim()).toBe('The owner’s country is now England')
      expect(document.querySelectorAll('form p.govuk-body')[0].textContent.trim()).toBe('Moving dogs from Scotland to England or Wales means:')
      expect(document.querySelectorAll('form p.govuk-body')[1].textContent.trim()).toBe('The police force is now New force.')

      expect(response.statusCode).toBe(200)
    })

    test('returns 404 when no session data', async () => {
      getFromSession.mockReturnValue(null)

      const options = {
        method: 'GET',
        url: '/cdo/edit/country-changed',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(404)
    })

    test('returns 302 when no auth', async () => {
      getFromSession.mockReturnValue({
        policeForce: 'New force',
        country: 'England'
      })

      const options = {
        method: 'GET',
        url: '/cdo/edit/country-changed'
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/login')
    })
  })

  describe('POST /cdo/edit/country-changed', () => {
    test('route returns 302 when all ok', async () => {
      setInSession.mockReturnValue()
      getFromSession.mockReturnValue({ country: 'England', policeResult: { policeForceResult: { policeForceName: 'Test Force' } } })

      const payload = {}

      const options = {
        method: 'POST',
        url: '/cdo/edit/country-changed',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location.startsWith('/cdo/edit/country-changed-info?src=')).toBeTruthy()
    })

    test('route returns 302 when all ok but force name not found', async () => {
      setInSession.mockReturnValue()
      getFromSession.mockReturnValue({ personReference: 'P-123', country: 'England', policeResult: { policeForceResult: { policeForceName: null } } })

      const payload = {}

      const options = {
        method: 'POST',
        url: '/cdo/edit/country-changed',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location.startsWith('/cdo/edit/police-force-not-found/P-123')).toBeTruthy()
    })

    test('route returns 404 when no session info', async () => {
      setInSession.mockReturnValue()
      getFromSession.mockReturnValue()

      const payload = {}

      const options = {
        method: 'POST',
        url: '/cdo/edit/country-changed',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(404)
    })

    test('route returns 302 /login when no auth', async () => {
      setInSession.mockReturnValue()

      const options = {
        method: 'POST',
        url: '/cdo/edit/country-changed'
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
