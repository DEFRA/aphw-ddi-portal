const { adminAuth, standardAuth } = require('../../../mocks/auth')

describe('documentation test', () => {
  let server
  jest.mock('../../../../app/lib/environment-helpers')
  const { getEnvironmentVariable } = require('../../../../app/lib/environment-helpers')
  getEnvironmentVariable.mockImplementation(envVariable => {
    if (envVariable === 'ENVIRONMENT_CODE') {
      return 'dev'
    }
    if (envVariable === 'DDI_API_BASE_URL') {
      return 'test'
    }
    return process.env[envVariable]
  })
  const createServer = require('../../../../app/server')

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET /documentation route returns 200 in local', async () => {
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
      if (envVariable === 'DDI_API_BASE_URL') {
        return 'test'
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
      if (envVariable === 'DDI_API_BASE_URL') {
        return 'test'
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
