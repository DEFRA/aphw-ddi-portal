const { adminAuth, standardAuth } = require('../../../../mocks/auth')

describe('documentation test', () => {
  jest.mock('../../../../../app/lib/environment-helpers')
  const { getEnvironmentVariable } = require('../../../../../app/lib/environment-helpers')
  getEnvironmentVariable.mockImplementation(envVariable => {
    if (envVariable === 'ENVIRONMENT_CODE') {
      return 'dev'
    }
    if (envVariable === 'DDI_API_BASE_URL') {
      return 'test'
    }
    return process.env[envVariable]
  })

  const createServer = require('../../../../../app/server')
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterEach(() => {
    jest.resetModules()
  })

  jest.mock('../../../../../app/api/ddi-index-api/documentation')
  const { getDocumentation } = require('../../../../../app/api/ddi-index-api/documentation')

  getDocumentation.mockResolvedValue({})

  test('GET /swagger.json route returns 200 in local', async () => {
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
      auth: adminAuth,
      url: '/swagger.json'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /swagger.json route returns 404 in production', async () => {
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
      url: '/swagger.json'
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
      url: '/swagger.json'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(403)
  })

  afterEach(async () => {
    await server.stop()
  })
})
