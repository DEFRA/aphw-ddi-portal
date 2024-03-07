const { auth, user } = require('../../../../../mocks/auth')
const FormData = require('form-data')
const { routes } = require('../../../../../../app/constants/cdo/owner')

describe('OwnerDetails test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/create/owner-details route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/create/owner-details',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('POST /cdo/create/owner-details route returns 302 if not auth', async () => {
    const fd = new FormData()
    fd.append('firstName', 'John')
    fd.append('lastName', 'Smith')

    const options = {
      method: 'POST',
      url: '/cdo/create/owner-details',
      headers: fd.getHeaders(),
      payload: fd.getBuffer()
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('POST /cdo/create/owner-details with invalid data returns error', async () => {
    const payload = {
      firstName: 'John',
      postcode: 'AB1 1TT'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
  })

  test('POST /cdo/create/owner-details with invalid date entry returns error 1', async () => {
    const payload = {
      firstName: 'John',
      postcode: 'AB1 1TT',
      dobDay: 'a'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.result.indexOf('Date of birth must include a day')).toBeGreaterThan(-1)
  })

  test('POST /cdo/create/owner-details with invalid date entry returns error 2', async () => {
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
      url: '/cdo/create/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.result.indexOf('Enter a real date')).toBeGreaterThan(-1)
  })

  test('POST /cdo/create/owner-details with invalid date entry returns error 3 (not 4 digit year)', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      postcode: 'AB1 1TT',
      dobDay: '32',
      dobMonth: '12',
      dobYear: '200'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.result.indexOf('Enter a real date')).toBeGreaterThan(-1)
  })

  test('POST /cdo/create/owner-details with invalid postcode returns 400 - scenario 1', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      postcode: 'AB1 1T',
      triggeredButton: 'primary'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.result.indexOf('Enter a real postcode')).toBeGreaterThan(-1)
  })

  test('POST /cdo/create/owner-details with invalid postcode returns 400 - scenario 2', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      postcode: 'AB1 TT',
      triggeredButton: 'primary'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.result.indexOf('Enter a real postcode')).toBeGreaterThan(-1)
  })

  test('POST /cdo/create/owner-details with invalid postcode returns 400 - scenario 3', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      postcode: 'S11',
      triggeredButton: 'primary'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.result.indexOf('Enter a real postcode')).toBeGreaterThan(-1)
  })

  test('POST /cdo/create/owner-details with invalid postcode returns 400 - scenario 4', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      postcode: 'S1',
      triggeredButton: 'primary'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.result.indexOf('Enter a real postcode')).toBeGreaterThan(-1)
  })

  test('POST /cdo/create/owner-details with invalid postcode returns 400 - scenario 5', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      postcode: 'S11 1TTT',
      triggeredButton: 'primary'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.result.indexOf('Enter a real postcode')).toBeGreaterThan(-1)
  })

  test('POST /cdo/create/owner-details with invalid postcode returns 400 - scenario 6', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      postcode: '111 111',
      triggeredButton: 'primary'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.result.indexOf('Enter a real postcode')).toBeGreaterThan(-1)
  })

  test('POST /cdo/create/owner-details with valid data forwards to next screen if postcode lookup', async () => {
    const nextScreenUrl = routes.selectAddress.get

    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      postcode: 'AB1 1TT',
      triggeredButton: 'primary'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(nextScreenUrl)
  })

  test('POST /cdo/create/owner-details with valid data forwards to next screen if postcode lookup - no spaces', async () => {
    const nextScreenUrl = routes.selectAddress.get

    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      postcode: 'AB11TT',
      triggeredButton: 'primary'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(nextScreenUrl)
  })

  test('POST /cdo/create/owner-details with valid data forwards to next screen if manual address entry', async () => {
    const nextScreenUrl = routes.address.get

    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      postcode: 'AB1 1TT'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(nextScreenUrl)
  })

  test('POST /cdo/create/owner-details validates date field if supplied - future date not allowed', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      postcode: 'AB1 1TT',
      dobDay: '24',
      dobMonth: '8',
      dobYear: '2030'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
  })

  test('POST /cdo/create/owner-details validates date field if supplied - age must be 16 or over', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      postcode: 'AB1 1TT',
      dobDay: '24',
      dobMonth: '8',
      dobYear: '2022'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/owner-details',
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
