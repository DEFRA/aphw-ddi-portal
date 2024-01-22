const { auth, user } = require('../../../../../mocks/auth')
const FormData = require('form-data')
const { routes } = require('../../../../../../app/constants/owner')

describe('Address test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/create/address route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/create/address',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('POST /cdo/create/address route returns 302 if not auth', async () => {
    const fd = new FormData()

    const options = {
      method: 'POST',
      url: '/cdo/create/address',
      headers: fd.getHeaders(),
      payload: fd.getBuffer()
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('POST /cdo/create/address with invalid data returns error', async () => {
    const payload = {
      addressLine2: 'locality',
      postcode: 'AB1 1TT'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/address',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
  })
  test('POST /cdo/create/address with valid data forwards to next screen', async () => {
    const nextScreenUrl = routes.enforcementDetails.get

    const payload = {
      addressLine1: '1 Testing Street',
      town: 'Testington',
      postcode: 'AB1 1TT'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/address',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(nextScreenUrl)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
