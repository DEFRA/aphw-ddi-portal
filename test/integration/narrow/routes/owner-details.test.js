const { admin } = require('../../../../app/auth/permissions')
const FormData = require('form-data')

describe('OwnerDetails test', () => {
  jest.mock('../../../../app/auth')
  const mockAuth = require('../../../../app/auth')

  const createServer = require('../../../../app/server')
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

  test('GET /register/owner/owner-details route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/register/owner/owner-details',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('POST /register/owner/owner-details route returns 302 if not auth', async () => {
    const fd = new FormData()
    fd.append('firstName', 'John')
    fd.append('lastName', 'Smith')

    const options = {
      method: 'POST',
      url: '/register/owner/owner-details',
      headers: fd.getHeaders(),
      payload: fd.getBuffer()
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('POST /register/owner/owner-details with invalid data returns error', async () => {
    const payload = {
      firstName: 'John',
      postcode: 'AB1 1TT'
    }

    const options = {
      method: 'POST',
      url: '/register/owner/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
  })

  test('POST /register/owner/owner-details with invalid date entry returns error 1', async () => {
    const payload = {
      firstName: 'John',
      postcode: 'AB1 1TT',
      dobDay: 'a'
    }

    const options = {
      method: 'POST',
      url: '/register/owner/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.result.indexOf('Date of birth must include a day')).toBeGreaterThan(-1)
  })

  test('POST /register/owner/owner-details with invalid date entry returns error 2', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      postcode: 'AB1 1TT',
      dobDay: '32',
      dobMonth: '12',
      dobYear: '2000'
    }

    const options = {
      method: 'POST',
      url: '/register/owner/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.result.indexOf('date of birth must be a real date.')).toBeGreaterThan(-1)
  })

  test('POST /register/owner/owner-details with valid data forwards to next screen', async () => {
    // TODO - change this when next screen is implemented
    const nextScreenUrl = '/register/owner/postcode'

    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      postcode: 'AB1 1TT'
    }

    const options = {
      method: 'POST',
      url: '/register/owner/owner-details',
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
