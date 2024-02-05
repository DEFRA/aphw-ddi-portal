const { auth, user } = require('../../../../../mocks/auth')
const FormData = require('form-data')
const { routes } = require('../../../../../../app/constants/cdo/owner')
const { getFromSession } = require('../../../../../../app/session/session-wrapper')
jest.mock('../../../../../../app/session/session-wrapper')

describe('SelectAddress test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/create/select-address route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/create/select-address',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('POST /cdo/create/select-address route returns 302 if not auth', async () => {
    const fd = new FormData()
    fd.append('firstName', 'John')
    fd.append('lastName', 'Smith')

    const options = {
      method: 'POST',
      url: '/cdo/create/select-address',
      headers: fd.getHeaders(),
      payload: fd.getBuffer()
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('POST /cdo/create/select-address with valid data returns 302', async () => {
    const nextScreenUrl = routes.enforcementDetails.get
    getFromSession.mockReturnValue([{ addressLine1: 'addr1', addressLine2: 'addr2', addressTown: 'town', addressPostcode: 'AB1 1TT', addressCountry: 'E' }])
    const payload = {
      address: 0
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/select-address',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(nextScreenUrl)
  })

  test('POST /cdo/create/select-address with invalid data returns error', async () => {
    getFromSession.mockReturnValue([{ addressLine1: 'addr1', addressLine2: 'addr2', addressTown: 'town', addressPostcode: 'AB1 1TT', addressCountry: 'E' }])
    const payload = {
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/select-address',
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
