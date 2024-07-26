const { adminAuth, standardAuth } = require('../../../mocks/auth')

describe('documentation test', () => {
  const createServer = require('../../../../app/server')
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  jest.mock('../../../../app/lib/environment-helpers')
  const { getEnvironmentVariable } = require('../../../../app/lib/environment-helpers')

  test('GET /documentation route returns 200 in local', async () => {
    getEnvironmentVariable.mockImplementation(envVariable => {
      if (envVariable === 'ENVIRONMENT_CODE') {
        return 'dev'
      }
      return process.env[envVariable]
    })
    const options = {
      method: 'GET',
      auth: adminAuth,
      url: '/documentation'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /documentation route returns 404 in production', async () => {
    getEnvironmentVariable.mockImplementation(envVariable => {
      if (envVariable === 'ENVIRONMENT_CODE') {
        return 'prod'
      }
      return process.env[envVariable]
    })
    const options = {
      method: 'GET',
      auth: adminAuth,
      url: '/documentation'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
  })

  test('GET /swagger.json route returns 403 in production', async () => {
    getEnvironmentVariable.mockImplementation(envVariable => {
      if (envVariable === 'ENVIRONMENT_CODE') {
        return 'dev'
      }
      return process.env[envVariable]
    })

    const options = {
      method: 'GET',
      auth: standardAuth,
      url: '/documentation'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(403)
  })

  afterEach(async () => {
    await server.stop()
  })
})
