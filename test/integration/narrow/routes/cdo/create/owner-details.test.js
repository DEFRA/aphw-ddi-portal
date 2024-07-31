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

  jest.mock('../../../../../../app/session/cdo')
  const { clearCdo } = require('../../../../../../app/session/cdo')

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
    expect(clearCdo).not.toHaveBeenCalled()
  })

  test('GET /cdo/create/owner-details route redirects and clears session if param supplied', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/create/owner-details?clear=true',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(clearCdo).toHaveBeenCalled()
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
      lastName: 'Smith',
      'dateOfBirth-day': 'a'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.result.indexOf('Date of birth must include a month and year')).toBeGreaterThan(-1)
  })

  test('POST /cdo/create/owner-details with invalid date entry returns error 2', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      'dateOfBirth-day': '32',
      'dateOfBirth-month': '12',
      'dateOfBirth-year': '2000'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.result.indexOf('Date must be a real date')).toBeGreaterThan(-1)
  })

  test('POST /cdo/create/owner-details with invalid date entry returns error 3 (not 4 digit year)', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      'dateOfBirth-day': '31',
      'dateOfBirth-month': '12',
      'dateOfBirth-year': '200'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.result.indexOf('Year must include four numbers')).toBeGreaterThan(-1)
  })

  test('POST /cdo/create/owner-details with valid data forwards to owner results screen', async () => {
    const nextScreenUrl = routes.selectOwner.get

    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      'dateOfBirth-day': '',
      'dateOfBirth-month': '',
      'dateOfBirth-year': ''
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
      'dateOfBirth-day': '',
      'dateOfBirth-month': '',
      'dateOfBirth-year': '',
      dateOfBirthEntered: null
    })
  })

  test('POST /cdo/create/owner-details with valid data and empty dob forwards to owner results screen', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      'dateOfBirth-day': '01',
      'dateOfBirth-month': '01',
      'dateOfBirth-year': '1999'
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
      'dateOfBirth-day': 1,
      'dateOfBirth-month': 1,
      'dateOfBirth-year': 1999,
      dateOfBirthEntered: new Date('1999-01-01')
    })
  })

  test('POST /cdo/create/owner-details updates owner details session given one exists', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      'dateOfBirth-day': '01',
      'dateOfBirth-month': '01',
      'dateOfBirth-year': '1999'
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
      'dateOfBirth-day': 1,
      'dateOfBirth-month': 1,
      'dateOfBirth-year': 1999,
      dateOfBirthEntered: new Date('1999-01-01'),
      postcode: 'E1 1AA',
      houseNumber: ''
    })
  })

  test('POST /cdo/create/owner-details updates owner details session correctly given one exists with DOB and person-reference', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      'dateOfBirth-day': '',
      'dateOfBirth-month': '',
      'dateOfBirth-year': ''
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
      'dateOfBirth-day': '',
      'dateOfBirth-month': '',
      'dateOfBirth-year': '',
      dateOfBirthEntered: null,
      postcode: 'E1 1AA',
      houseNumber: ''
    })
  })

  test('POST /cdo/create/owner-details validates date field if supplied - future date not allowed', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      'dateOfBirth-day': '24',
      'dateOfBirth-month': '8',
      'dateOfBirth-year': '2030'
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
      'dateOfBirth-day': '24',
      'dateOfBirth-month': '8',
      'dateOfBirth-year': '2022'
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
