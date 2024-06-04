const { auth, user } = require('../../../mocks/auth')

describe('Cookies test', () => {
  jest.mock('../../../../app/auth')
  const mockAuth = require('../../../../app/auth')

  const createServer = require('../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET /cookies route returns 302', async () => {
    const options = {
      method: 'GET',
      url: '/cookies'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('GET /cookies route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/cookies',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('POST /cookies completes without error', async () => {
    const payload = {
      analytics: true,
      async: true
    }

    const options = {
      method: 'POST',
      url: '/cookies',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('POST /cookies completes without error given synchronous call', async () => {
    const payload = {
      analytics: true,
      async: false
    }

    const options = {
      method: 'POST',
      url: '/cookies',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  afterEach(async () => {
    await server.stop()
  })
})
