const { auth, user } = require('../../../../mocks/auth')
const FormData = require('form-data')
const { setInSession } = require('../../../../../app/session/session-wrapper')
jest.mock('../../../../../app/session/session-wrapper')
const { doSearch } = require('../../../../../app/api/ddi-index-api/search')
jest.mock('../../../../../app/api/ddi-index-api/search'
)
describe('SearchBasic test', () => {
  jest.mock('../../../../../app/auth')
  const mockAuth = require('../../../../../app/auth')

  const createServer = require('../../../../../app/server')
  let server

  setInSession.mockReturnValue()

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

  test('GET /cdo/search/basic route returns 302 if not auth', async () => {
    const fd = new FormData()

    const options = {
      method: 'GET',
      url: '/cdo/search/basic',
      headers: fd.getHeaders(),
      payload: fd.getBuffer()
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('GET /cdo/search/basic with valid data returns 200', async () => {
    doSearch.mockResolvedValue([])

    const options = {
      method: 'GET',
      url: '/cdo/search/basic?searchTerms=term1&searchType=dog',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /cdo/create/select-address with invalid data returns error', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/search/basic?searchTerms=',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
  })

  test('GET /cdo/create/select-address with invalid data returns error - invalid chars', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/search/basic?searchTerms=**abc&&',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
