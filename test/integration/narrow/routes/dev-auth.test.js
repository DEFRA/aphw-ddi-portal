const auth = require('../../../../app/auth')
jest.mock('../../../../app/auth')

describe('DevAuth test', () => {
  const createServer = require('../../../../app/server')
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET /dev-auth route returns 302', async () => {
    auth.authenticate.mockResolvedValue({})

    const options = {
      method: 'GET',
      url: '/dev-auth'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('GET /dev-auth route throws error', async () => {
    auth.authenticate.mockImplementation(() => {
      throw new Error('dummy auth error')
    })

    const options = {
      method: 'GET',
      url: '/dev-auth'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(500)
  })

  afterEach(async () => {
    await server.stop()
  })
})
