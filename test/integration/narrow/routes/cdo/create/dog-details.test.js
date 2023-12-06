const { admin } = require('../../../../../../app/auth/permissions')
const querystring = require('querystring')
const { UTCDate } = require('@date-fns/utc')
const { JSDOM } = require('jsdom')

describe('Add dog details', () => {
  jest.mock('../../../../../../app/api/ddi-index-api')
  const { getBreeds } = require('../../../../../../app/api/ddi-index-api')

  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/session/cdo/dog')
  const { getDog, setDog } = require('../../../../../../app/session/cdo/dog')

  const createServer = require('../../../../../../app/server')
  let server

  const auth = { strategy: 'session-auth', credentials: { scope: [admin] } }

  const user = {
    userId: '1',
    username: 'test@example.com'
  }

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    getBreeds.mockResolvedValue({
      breeds: [
        { breed: 'Breed 1' },
        { breed: 'Breed 2' },
        { breed: 'Breed 3' }
      ]
    })

    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/create/dog-details route returns 200', async () => {
    getDog.mockReturnValue({
      breed: 'Breed 1',
      name: 'Bruce',
      cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z')
    })

    const options = {
      method: 'GET',
      url: '/cdo/create/dog-details',
      auth
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(200)
    expect(document.querySelector('#breed').hasAttribute('checked')).toBeTruthy()
    expect(document.querySelector('#name').getAttribute('value')).toBe('Bruce')
    expect(document.querySelector('#cdoIssued-day').getAttribute('value')).toBe('10')
    expect(document.querySelector('#cdoIssued-month').getAttribute('value')).toBe('10')
    expect(document.querySelector('#cdoIssued-year').getAttribute('value')).toBe('2020')
  })

  test('GET /cdo/create/dog-details route returns 404 if no dog in session', async () => {
    getDog.mockReturnValue(undefined)

    const options = {
      method: 'GET',
      url: '/cdo/create/dog-details',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(404)
  })

  test('GET /cdo/create/owner-details route returns 302 if not auth', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/create/dog-details'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('POST /cdo/create/dog-details route with valid payload returns 302', async () => {
    const payload = {
      breed: 'Breed 1',
      name: 'Bruce',
      'cdoIssued-day': '10',
      'cdoIssued-month': '10',
      'cdoIssued-year': '2020'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/dog-details',
      auth,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      payload: querystring.stringify(payload)
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(302)
    expect(setDog).toHaveBeenCalledTimes(1)
    expect(setDog).toHaveBeenCalledWith(expect.anything(), {
      breed: 'Breed 1',
      name: 'Bruce',
      cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z'),
      cdoExpiry: new UTCDate('2020-12-10T00:00:00.000Z')
    })
    expect(response.headers.location).toContain('/cdo/create/confirm-dog-details')
  })

  test('POST /cdo/create/dog-details route with invalid dog id returns 400', async () => {
    const payload = {
      breed: 'Breed 1',
      name: 'Bruce',
      'cdoIssued-day': '10',
      'cdoIssued-month': '10',
      'cdoIssued-year': '2020',
      dogId: 2
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/dog-details',
      auth,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      payload: querystring.stringify(payload)
    }

    setDog.mockImplementation(() => {
      const error = new Error('Dog not found')

      error.type = 'DOG_NOT_FOUND'

      throw error
    })

    const response = await server.inject(options)

    expect(response.statusCode).toBe(400)
    expect(setDog).toHaveBeenCalledTimes(1)
  })

  test('POST /cdo/create/dog-details route with invalid payload should show errors', async () => {
    const options = {
      method: 'POST',
      url: '/cdo/create/dog-details',
      auth,
      payload: {}
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(400)
    expect(setDog).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()
    expect(document.querySelectorAll('.govuk-error-summary li').length).toBe(5)

    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())

    expect(messages).toContain('Breed type is required')
    expect(messages).toContain('CDO issue date must include a valid day')
    expect(messages).toContain('CDO issue date must include a valid month')
    expect(messages).toContain('CDO issue date must include a valid year')
    expect(messages).toContain('CDO issue date must be a valid date')
  })

  test('POST /cdo/create/dog-details route with invalid date should display error', async () => {
    const options = {
      method: 'POST',
      url: '/cdo/create/dog-details',
      auth,
      payload: {
        breed: 'Breed 1',
        name: 'Bruce',
        'cdoIssued-day': '40',
        'cdoIssued-month': '10',
        'cdoIssued-year': '2021'
      }
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(400)
    expect(setDog).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())

    expect(messages).toContain('CDO issue date must be a valid date')
  })

  test('POST /cdo/create/dog-details route with future date should display error', async () => {
    const options = {
      method: 'POST',
      url: '/cdo/create/dog-details',
      auth,
      payload: {
        breed: 'Breed 1',
        name: 'Bruce',
        'cdoIssued-day': '01',
        'cdoIssued-month': '01',
        'cdoIssued-year': '9999'
      }
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(400)
    expect(setDog).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())

    expect(messages).toContain('CDO issue date must not be in the future')
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
