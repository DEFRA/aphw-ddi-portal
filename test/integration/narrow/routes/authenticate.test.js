const auth = require('../../../../app/auth')
jest.mock('../../../../app/auth')

describe('Authenticate test', () => {
  const createServer = require('../../../../app/server')
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  test('GET /authenticate route returns 302', async () => {
    auth.authenticate.mockResolvedValue({})

    const options = {
      method: 'GET',
      url: '/authenticate'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('GET /authenticate route throws error', async () => {
    auth.authenticate.mockImplementation(() => {
      throw new Error('dummy auth error')
    })

    const options = {
      method: 'GET',
      url: '/authenticate'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(500)
  })
})
