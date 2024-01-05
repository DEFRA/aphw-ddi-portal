const { admin } = require('../../../../../app/auth/permissions')

describe('Export test', () => {
  const createServer = require('../../../../../app/server')
  let server

  jest.mock('../../../../../app/api/ddi-index-api/export')
  const { exportData } = require('../../../../../app/api/ddi-index-api/export')

  jest.mock('../../../../../app/auth')
  const mockAuth = require('../../../../../app/auth')

  const auth = { strategy: 'session-auth', credentials: { scope: [admin] } }

  const user = {
    userId: '1',
    username: 'test@example.com'
  }

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET /export route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/export',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('POST /export route returns 302 if not auth', async () => {
    const options = {
      method: 'POST',
      url: '/export'
    }

    exportData.mockResolvedValue({})
    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('POST /export route returns 200 and calls exportData', async () => {
    const options = {
      method: 'POST',
      url: '/export',
      auth
    }

    exportData.mockResolvedValue({})
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  afterEach(async () => {
    await server.stop()
  })
})
