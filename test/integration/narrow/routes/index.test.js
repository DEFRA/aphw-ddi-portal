const { auth, user } = require('../../../mocks/auth')

describe('Index test', () => {
  const createServer = require('../../../../app/server')
  let server

  jest.mock('../../../../app/auth')
  const mockAuth = require('../../../../app/auth')

  jest.mock('../../../../app/session/cdo')
  const { clearCdo } = require('../../../../app/session/cdo')

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET / route returns 302', async () => {
    const options = {
      method: 'GET',
      url: '/'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('GET / route returns 200 and clears previous details', async () => {
    const options = {
      method: 'GET',
      url: '/',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(clearCdo).toHaveBeenCalledWith({})
  })

  afterEach(async () => {
    await server.stop()
  })
})
