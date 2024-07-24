const { adminAuth, standardAuth } = require('../../../../mocks/auth')

describe('Purge Soft-Delete test', () => {
  const createServer = require('../../../../../app/server')
  let server

  jest.mock('../../../../../app/api/ddi-index-api/jobs')
  const { purgeSoftDelete, neuteringDeadline } = require('../../../../../app/api/ddi-index-api/jobs')

  beforeEach(async () => {
    purgeSoftDelete.mockResolvedValue()
    neuteringDeadline.mockResolvedValue({ response: 'Success Neutering Expiry - updated 0 rows' })
    server = await createServer()
    await server.initialize()
  })

  describe('GET /jobs/purge-soft-delete', () => {
    test('route returns 200', async () => {
      const options = {
        method: 'GET',
        url: '/jobs/purge-soft-delete',
        auth: adminAuth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)
    })

    test('returns 302 if not auth', async () => {
      const options = {
        method: 'GET',
        url: '/jobs/purge-soft-delete'
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
    })

    test('returns 403 if not admin user', async () => {
      const options = {
        method: 'GET',
        url: '/jobs/purge-soft-delete',
        auth: standardAuth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(403)
    })
  })

  describe('GET /jobs/neutering-deadline', () => {
    test('route returns 200', async () => {
      const options = {
        method: 'GET',
        url: '/jobs/neutering-deadline',
        auth: adminAuth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)
      expect(JSON.parse(response.payload)).toEqual({ response: 'Success Neutering Expiry - updated 0 rows' })
    })

    test('route returns 200 given today is posted', async () => {
      const options = {
        method: 'GET',
        url: '/jobs/neutering-deadline?today=2024-07-27',
        auth: adminAuth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)
    })

    test('returns 302 if not auth', async () => {
      const options = {
        method: 'GET',
        url: '/jobs/neutering-deadline'
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
    })

    test('returns 403 if not admin user', async () => {
      const options = {
        method: 'GET',
        url: '/jobs/neutering-deadline',
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
