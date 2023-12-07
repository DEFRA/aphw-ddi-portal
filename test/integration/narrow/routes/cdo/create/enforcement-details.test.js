const { admin } = require('../../../../../../app/auth/permissions')
const FormData = require('form-data')
const { routes } = require('../../../../../../app/constants/owner')

describe('EnforcementDetails test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')
  const { getCourts } = require('../../../../../../app/api/ddi-index-api/courts')
  jest.mock('../../../../../../app/api/ddi-index-api/courts')
  const { getPoliceForces } = require('../../../../../../app/api/ddi-index-api/police-forces')
  jest.mock('../../../../../../app/api/ddi-index-api/police-forces')

  const createServer = require('../../../../../../app/server')
  let server

  const auth = { strategy: 'session-auth', credentials: { scope: [admin] } }

  const user = {
    userId: '1',
    username: 'test@example.com'
  }

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    getCourts.mockResolvedValue([{ id: 1, name: 'Test court' }])
    getPoliceForces.mockResolvedValue([{ id: 1, name: 'Test force' }])
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/create/enforcement-details route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/create/enforcement-details',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('POST /cdo/create/enforcement-details route returns 302 if not auth', async () => {
    const fd = new FormData()
    fd.append('court', '1')

    const options = {
      method: 'POST',
      url: '/cdo/create/enforcement-details',
      headers: fd.getHeaders(),
      payload: fd.getBuffer()
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('POST /cdo/create/enforcement-details with invalid data returns error', async () => {
    const payload = {
      court: '1',
      legislationOfficer: 'John Smith'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/enforcement-details',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
  })

  test('POST /cdo/create/enforcement-details with valid data forwards to next screen', async () => {
    const nextScreenUrl = routes.ownerSummary.get

    const payload = {
      court: '1',
      policeForce: '2'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/enforcement-details',
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
