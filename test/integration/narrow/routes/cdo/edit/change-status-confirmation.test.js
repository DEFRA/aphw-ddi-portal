const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Change status confirmation', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/cdo')
  const { getCdo } = require('../../../../../../app/api/ddi-index-api/cdo')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/edit/change-status-confirmation route returns 200', async () => {
    getCdo.mockResolvedValue({
      dog: {
        status: 'Pre-exempt',
        indexNumber: 'ED12345'
      }
    })

    const options = {
      method: 'GET',
      url: '/cdo/edit/change-status-confirmation/ED12345',
      auth
    }

    const response = await server.inject(options)
    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelector('.govuk-panel__body').textContent.trim()).toBe('Applying for exemption')

    expect(response.statusCode).toBe(200)
  })

  test('GET /cdo/edit/change-status-confirmation route returns 404 when dog not found', async () => {
    getCdo.mockResolvedValue(null)

    const options = {
      method: 'GET',
      url: '/cdo/edit/change-status-confirmation/ED12345',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(404)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
