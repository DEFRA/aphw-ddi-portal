const { auth, user } = require('../../../mocks/auth')
const mockAuth = require('../../../../app/auth')
jest.mock('../../../../app/auth')

describe('Logout test', () => {
  const createServer = require('../../../../app/server')
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
  })

  test('GET /logout route returns 302', async () => {
    mockAuth.logout.mockResolvedValue(true)

    const options = {
      method: 'GET',
      url: '/logout',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })
})
