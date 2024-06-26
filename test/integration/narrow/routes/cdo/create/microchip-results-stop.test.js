const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Microchip results stop tests', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/session/cdo/dog')
  const { getMicrochipResults } = require('../../../../../../app/session/cdo/dog')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  describe('GET /cdo/create/microchip-results-stop', () => {
    test('route returns 200', async () => {
      getMicrochipResults.mockReturnValue({ microchipNumber: '12345' })

      const options = {
        method: 'GET',
        url: '/cdo/create/microchip-results-stop',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('h1').textContent.trim()).toBe('You cannot proceed with this application')
      expect(document.querySelector('p span').textContent.trim()).toBe('Microchip number')
      expect(document.querySelectorAll('form p')[0].textContent.trim()).toContain('12345')
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
