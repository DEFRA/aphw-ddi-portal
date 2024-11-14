const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Police force not found', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/session/session-wrapper')
  const { setInSession, getFromSession } = require('../../../../../../app/session/session-wrapper')

  jest.mock('../../../../../../app/api/ddi-index-api/person')
  const { getPersonAndDogs } = require('../../../../../../app/api/ddi-index-api/person')

  jest.mock('../../../../../../app/api/ddi-index-api/cdo')
  const { getCdo } = require('../../../../../../app/api/ddi-index-api/cdo')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  describe('GET /cdo/edit/police-force-not-found', () => {
    test('route returns 200', async () => {
      getPersonAndDogs.mockResolvedValue({
        address: {
          addressLine1: 'addr1',
          town: 'town',
          postcode: 'postcode',
          country: 'England'
        },
        dogs: [
          { indexNumber: 'ED123' },
          { indexNumber: 'ED456' }
        ]
      })
      getCdo.mockResolvedValue({ exemption: { policeForce: 'Test Police' } })
      const options = {
        method: 'GET',
        url: '/cdo/edit/police-force-not-found/P-123',
        auth
      }

      const response = await server.inject(options)
      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelector('h1').textContent.trim()).toBe('Check if the police force also needs to change')
      expect(document.querySelectorAll('form p.govuk-body')[0].textContent.trim()).toBe('The police force is currently Test Police.')
      expect(document.querySelectorAll('form p.govuk-body')[2].textContent.trim()).toContain('addr1')
      expect(document.querySelectorAll('form p.govuk-body')[2].textContent.trim()).toContain('town')
      expect(document.querySelectorAll('form p.govuk-body')[2].textContent.trim()).toContain('postcode')
      expect(document.querySelectorAll('form p.govuk-body')[2].textContent.trim()).toContain('England')

      expect(response.statusCode).toBe(200)
    })

    test('route returns 404 if person not found', async () => {
      getPersonAndDogs.mockResolvedValue(null)
      getCdo.mockResolvedValue()
      const options = {
        method: 'GET',
        url: '/cdo/edit/police-force-not-found/P-123',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(404)
    })

    test('route handles orphaned owner', async () => {
      getFromSession.mockReturnValue('/cdo/view/owner/return-point')
      getPersonAndDogs.mockResolvedValue({ dogs: [] })
      getCdo.mockResolvedValue()
      const options = {
        method: 'GET',
        url: '/cdo/edit/police-force-not-found/P-123',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/cdo/view/owner/return-point')
    })
  })

  describe('POST /cdo/edit/police-force-not-found', () => {
    test('route returns 302 when all ok', async () => {
      setInSession.mockReturnValue()
      getFromSession.mockReturnValue('/cdo/view/owner/return-point')

      const payload = {}

      const options = {
        method: 'POST',
        url: '/cdo/edit/police-force-not-found/P-123',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/cdo/view/owner/return-point')
    })

    test('route forwards to country changed info', async () => {
      setInSession.mockReturnValue()
      getFromSession.mockReturnValue({ countryChanged: true })

      const payload = {}

      const options = {
        method: 'POST',
        url: '/cdo/edit/police-force-not-found/P-123',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location.startsWith('/cdo/edit/country-changed-info?src=')).toBeTruthy()
    })

    test('route returns 302 /login when no auth', async () => {
      setInSession.mockReturnValue()

      const options = {
        method: 'POST',
        url: '/cdo/edit/police-force-not-found/P-123'
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
