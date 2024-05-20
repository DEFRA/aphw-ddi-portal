const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Microchip results tests', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/session/cdo/dog')
  const { getMicrochipResults } = require('../../../../../../app/session/cdo/dog')

  jest.mock('../../../../../../app/session/cdo/owner')
  const { getOwnerDetails } = require('../../../../../../app/session/cdo/owner')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/create/microchip-results route returns 200', async () => {
    getMicrochipResults.mockReturnValue({ microchipNumber: '12345', results: [{ dogName: 'Rex', microchipNumber: '12345' }] })
    getOwnerDetails.mockReturnValue({ firstName: 'John', lastName: 'Smith' })

    const options = {
      method: 'GET',
      url: '/cdo/create/microchip-results',
      auth
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(200)
    expect(document.querySelector('h1').textContent.trim()).toBe('Microchip number 12345 is in use on a current dog record with a different owner')
  })

  describe('POST /cdo/create/microchip-results', () => {
    test('route with invalid payload returns 400 error', async () => {
      const payload = {}

      const options = {
        method: 'POST',
        url: '/cdo/create/microchip-results/1',
        auth,
        payload
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('#confirm-error').textContent.trim()).toBe('Error: Select an option')
    })

    test('route with Y payload redirects to application type', async () => {
      const payload = { confirm: 'Y' }

      const options = {
        method: 'POST',
        url: '/cdo/create/microchip-results/1',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/cdo/create/application-type/1')
    })

    test('route with N payload redirects to microchip-results-stop', async () => {
      const payload = { confirm: 'N' }

      const options = {
        method: 'POST',
        url: '/cdo/create/microchip-results/1',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/cdo/create/microchip-results-stop/1')
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
