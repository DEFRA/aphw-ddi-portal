const { admin } = require('../../../../../app/auth/permissions')
const FormData = require('form-data')
const { routes } = require('../../../../../app/constants/search')

describe('SearchBasic test', () => {
  jest.mock('../../../../../app/auth')
  const mockAuth = require('../../../../../app/auth')

  const createServer = require('../../../../../app/server')
  let server

  const auth = { strategy: 'session-auth', credentials: { scope: [admin] } }

  const user = {
    userId: '1',
    username: 'test@example.com'
  }

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/search/basic route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/search/basic',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('POST /cdo/search/basic route returns 302 if not auth', async () => {
    const fd = new FormData()

    const options = {
      method: 'POST',
      url: '/cdo/search/basic',
      headers: fd.getHeaders(),
      payload: fd.getBuffer()
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('POST /cdo/search/basic with valid data returns 302', async () => {
    const nextScreenUrl = routes.searchBasic.get
    const payload = { searchTerms: 'term1', searchType: 'owner' }

    const options = {
      method: 'POST',
      url: '/cdo/search/basic',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(nextScreenUrl)
  })

  test('POST /cdo/create/select-address with invalid data returns error', async () => {
    const payload = {
    }

    const options = {
      method: 'POST',
      url: '/cdo/search/basic',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
