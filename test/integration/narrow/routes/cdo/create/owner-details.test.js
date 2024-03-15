const { auth, user } = require('../../../../../mocks/auth')
const FormData = require('form-data')
const { routes } = require('../../../../../../app/constants/cdo/owner')

describe('OwnerDetails test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  const createServer = require('../../../../../../app/server')
  let server

  jest.mock('../../../../../../app/session/cdo/owner')
  const { setOwnerDetails, getOwnerDetails } = require('../../../../../../app/session/cdo/owner')

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
      firstName: 'John'
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

  test('POST /cdo/create/owner-details with valid data forwards to owner results screen', async () => {
    const nextScreenUrl = routes.selectOwner.get

    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      dobDay: '',
      dobMonth: '',
      dobYear: ''
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
    expect(setOwnerDetails).toBeCalledWith(expect.anything(), {
      firstName: 'John',
      lastName: 'Smith',
      dobDay: '',
      dobMonth: '',
      dobYear: ''
    })
  })

  test('POST /cdo/create/owner-details with valid data and empty dob forwards to owner results screen', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      dobDay: '01',
      dobMonth: '01',
      dobYear: '1999'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(setOwnerDetails).toBeCalledWith(expect.anything(), {
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: new Date('1999-01-01'),
      dobDay: 1,
      dobMonth: 1,
      dobYear: 1999
    })
  })

  test('POST /cdo/create/owner-details updates owner details session given one exists', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      dobDay: '01',
      dobMonth: '01',
      dobYear: '1999'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/owner-details',
      auth,
      payload
    }

    getOwnerDetails.mockReturnValue({
      firstName: 'Cruella',
      lastName: 'de Vil',
      postcode: 'E1 1AA',
      houseNumber: ''
    })

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(setOwnerDetails).toBeCalledWith(expect.anything(), {
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: new Date('1999-01-01'),
      dobDay: 1,
      dobMonth: 1,
      dobYear: 1999,
      postcode: 'E1 1AA',
      houseNumber: ''
    })
  })

  test('POST /cdo/create/owner-details updates owner details session correctly given one exists with DOB and person-reference', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      dobDay: '',
      dobMonth: '',
      dobYear: ''
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/owner-details',
      auth,
      payload
    }

    getOwnerDetails.mockReturnValue({
      firstName: 'Cruella',
      lastName: 'de Vil',
      postcode: 'E1 1AA',
      houseNumber: '',
      dateOfBirth: '1999-01-01',
      personReference: 'P-1234-5678'
    })

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(setOwnerDetails).toBeCalledWith(expect.anything(), {
      firstName: 'John',
      lastName: 'Smith',
      dobDay: '',
      dobMonth: '',
      dobYear: '',
      postcode: 'E1 1AA',
      houseNumber: ''
    })
  })

  test('POST /cdo/create/owner-details validates date field if supplied - future date not allowed', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
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
