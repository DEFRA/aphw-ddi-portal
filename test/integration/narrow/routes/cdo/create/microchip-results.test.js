const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Microchip results tests', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/session/cdo/dog')
  const { getMicrochipDetails } = require('../../../../../../app/session/cdo/dog')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/create/microchip-results route returns 200', async () => {
    getMicrochipDetails.mockReturnValue({})

    const options = {
      method: 'GET',
      url: '/cdo/create/microchip-results',
      auth
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(200)
    expect(document.querySelector('h1').textContent.trim()).toBe('There’s an existing dog record with microchip number')
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
