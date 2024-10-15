const { auth, user } = require('../../../mocks/auth')

describe('Accessibility test', () => {
  jest.mock('../../../../app/auth')
  const mockAuth = require('../../../../app/auth')

  const createServer = require('../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET /accessibility route returns 302 if not auth', async () => {
    const options = {
      method: 'GET',
      url: '/accessibility'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('GET /accessibility route returns 200 if auth ok', async () => {
    const options = {
      method: 'GET',
      url: '/accessibility',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  afterEach(async () => {
    await server.stop()
  })
})
