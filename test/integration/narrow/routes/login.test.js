const auth = require('../../../../app/auth')
jest.mock('../../../../app/auth')

describe('Login test', () => {
  const createServer = require('../../../../app/server')
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET /login route returns 302', async () => {
    auth.getAuthenticationUrl.mockResolvedValue('http://test.com')

    const options = {
      method: 'GET',
      url: '/login'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('GET /login route throws error', async () => {
    auth.getAuthenticationUrl.mockImplementation(() => {
      throw new Error('dummy auth error')
    })

    const options = {
      method: 'GET',
      url: '/login'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(500)
  })

  afterEach(async () => {
    await server.stop()
  })
})
