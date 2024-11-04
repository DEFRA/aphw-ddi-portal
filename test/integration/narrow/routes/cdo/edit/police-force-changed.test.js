const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Police force changed', () => {
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

  describe('GET /cdo/edit/police-force-changed', () => {
    test('route returns 200 - single dog', async () => {
      getFromSession.mockReturnValue({
        policeResult: {
          policeForceResult: {
            changed: true,
            policeForceName: 'New force',
            numOfDogs: 1
          }
        }
      })

      const options = {
        method: 'GET',
        url: '/cdo/edit/police-force-changed',
        auth
      }

      const response = await server.inject(options)
      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelector('h1').textContent.trim()).toBe('The police force for the dog record has changed')
      expect(document.querySelector('form p.govuk-body').textContent.trim()).toBe('The police force is now New force.')

      expect(response.statusCode).toBe(200)
    })

    test('route returns 200 - multiple dogs', async () => {
      getFromSession.mockReturnValue({
        policeResult: {
          policeForceResult: {
            changed: true,
            policeForceName: 'New force',
            numOfDogs: 2
          }
        }
      })

      const options = {
        method: 'GET',
        url: '/cdo/edit/police-force-changed',
        auth
      }

      const response = await server.inject(options)
      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelector('h1').textContent.trim()).toBe('The police force for the dog records has changed')
      expect(document.querySelector('form p.govuk-body').textContent.trim()).toBe('The police force is now New force.')

      expect(response.statusCode).toBe(200)
    })

    test('returns 404 when no session data', async () => {
      getFromSession.mockReturnValue(null)

      const options = {
        method: 'GET',
        url: '/cdo/edit/police-force-changed',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(404)
    })

    test('returns 302 when no auth', async () => {
      getFromSession.mockReturnValue({
        policeResult: {
          policeForceResult: {
            changed: true,
            policeForceName: 'New force',
            numOfDogs: 1
          }
        }
      })

      const options = {
        method: 'GET',
        url: '/cdo/edit/police-force-changed'
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/login')
    })
  })

  describe('POST /cdo/edit/police-force-changed', () => {
    test('route returns 302 when all ok', async () => {
      setInSession.mockReturnValue()
      getFromSession.mockReturnValue('/cdo/view/owner/return-point')

      const payload = {}

      const options = {
        method: 'POST',
        url: '/cdo/edit/police-force-changed',
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
        url: '/cdo/edit/police-force-changed'
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
