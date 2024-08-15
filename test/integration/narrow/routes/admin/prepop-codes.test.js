const { adminAuth, standardAuth } = require('../../../../mocks/auth')

describe('Prepop codes test', () => {
  const createServer = require('../../../../../app/server')
  let server

  jest.mock('../../../../../app/api/ddi-index-api/prepop-codes')
  const { prepopCodes } = require('../../../../../app/api/ddi-index-api/prepop-codes')

  beforeEach(async () => {
    prepopCodes.mockResolvedValue()
    server = await createServer()
    await server.initialize()
  })

  describe('GET /admin/prepop-codes', () => {
    test('returns 200 for admin user', async () => {
      const options = {
        method: 'GET',
        url: '/admin/prepop-codes',
        auth: adminAuth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)
    })

    test('returns 302 if not auth', async () => {
      const options = {
        method: 'GET',
        url: '/admin/prepop-codes'
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
    })

    test('returns 403 if standard user', async () => {
      const options = {
        method: 'GET',
        url: '/admin/prepop-codes',
        auth: standardAuth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(403)
    })
  })

  afterEach(async () => {
    await server.stop()
  })
})
