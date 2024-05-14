const { auth: adminUser, standardAuth, user } = require('../../../../mocks/auth')

describe('Export test', () => {
  const createServer = require('../../../../../app/server')
  let server

  jest.mock('../../../../../app/api/ddi-index-api/export')
  const { exportData } = require('../../../../../app/api/ddi-index-api/export')

  jest.mock('../../../../../app/auth')
  const mockAuth = require('../../../../../app/auth')

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET /export route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/export',
      auth: adminUser
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

  test('POST /export route returns 200 and calls exportData for admin user', async () => {
    const options = {
      method: 'POST',
      url: '/export',
      auth: adminUser
    }

    exportData.mockResolvedValue({})
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  describe('GET /export-create-file', () => {
    test('returns 200 for admin user', async () => {
      const options = {
        method: 'GET',
        url: '/export-create-file',
        auth: adminUser
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)
    })

    test('returns 302 if not auth', async () => {
      const options = {
        method: 'GET',
        url: '/export-create-file'
      }

      exportData.mockResolvedValue({})
      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
    })

    test('returns 403 if standard user', async () => {
      const options = {
        method: 'GET',
        url: '/export-create-file',
        auth: standardAuth
      }

      exportData.mockResolvedValue({})
      const response = await server.inject(options)
      expect(response.statusCode).toBe(403)
    })
  })

  afterEach(async () => {
    await server.stop()
  })
})
