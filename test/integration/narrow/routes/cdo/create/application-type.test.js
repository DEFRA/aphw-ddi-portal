const { auth, user } = require('../../../../../mocks/auth')
const querystring = require('querystring')
const { UTCDate } = require('@date-fns/utc')
const { JSDOM } = require('jsdom')

describe('Application type', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/session/cdo/dog')
  const { getDog, setDog, getMicrochipResults } = require('../../../../../../app/session/cdo/dog')

  jest.mock('../../../../../../app/session/cdo/owner')
  const { getOwnerDetails } = require('../../../../../../app/session/cdo/owner')

  jest.mock('../../../../../../app/lib/model-helpers')
  const { setPoliceForce } = require('../../../../../../app/lib/model-helpers')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    getOwnerDetails.mockReturnValue({ address: { postcode: 'TS1 1TS' } })
    setPoliceForce.mockResolvedValue()
    getMicrochipResults.mockReturnValue()
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/create/application-type route returns 200', async () => {
    getDog.mockReturnValue({
      breed: 'Breed 1',
      name: 'Bruce',
      cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z')
    })

    const options = {
      method: 'GET',
      url: '/cdo/create/application-type',
      auth
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(200)
    expect(document.querySelector('#cdoIssued-day').getAttribute('value')).toBe('10')
    expect(document.querySelector('#cdoIssued-month').getAttribute('value')).toBe('10')
    expect(document.querySelector('#cdoIssued-year').getAttribute('value')).toBe('2020')
    expect(document.querySelector('.govuk-back-link').getAttribute('href')).toBe('/cdo/create/select-existing-dog')
  })

  test('GET /cdo/create/application-type route returns 200 with correct backLink when visited existing microchip', async () => {
    getDog.mockReturnValue({
      breed: 'Breed 1',
      name: 'Bruce',
      cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z')
    })

    getMicrochipResults.mockReturnValue({ results: [{ indeNumber: 'ED100' }] })

    const options = {
      method: 'GET',
      url: '/cdo/create/application-type/1',
      auth
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(200)
    expect(document.querySelector('#cdoIssued-day').getAttribute('value')).toBe('10')
    expect(document.querySelector('#cdoIssued-month').getAttribute('value')).toBe('10')
    expect(document.querySelector('#cdoIssued-year').getAttribute('value')).toBe('2020')
    expect(document.querySelector('.govuk-back-link').getAttribute('href')).toBe('/cdo/create/microchip-results/1')
  })

  test('GET /cdo/create/application-type route returns 404 if no dog in session', async () => {
    getDog.mockReturnValue(undefined)

    const options = {
      method: 'GET',
      url: '/cdo/create/application-type',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(404)
  })

  test('GET /cdo/create/application-type route returns 302 if not auth', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/create/application-type'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('POST /cdo/create/application-type route with valid CDO payload returns 302', async () => {
    const payload = {
      applicationType: 'cdo',
      'cdoIssued-day': '10',
      'cdoIssued-month': '10',
      'cdoIssued-year': '2020'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/application-type',
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
      applicationType: 'cdo',
      interimExemption: null,
      cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z'),
      cdoExpiry: new UTCDate('2020-12-10T00:00:00.000Z')
    })
    expect(response.headers.location).toContain('/cdo/create/enforcement-details')
  })

  test('POST /cdo/create/application-type route with valid interim scheme payload returns 302', async () => {
    const today = new Date(new Date().toDateString())

    const payload = {
      applicationType: 'interim-exemption',
      'interimExemption-day': today.getDate(),
      'interimExemption-month': today.getMonth() + 1,
      'interimExemption-year': today.getFullYear()
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/application-type',
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
      applicationType: 'interim-exemption',
      interimExemption: today,
      cdoIssued: null,
      cdoExpiry: null
    })
    expect(response.headers.location).toContain('/cdo/create/enforcement-details')
  })

  test('POST /cdo/create/application-type route with invalid dog id returns 400', async () => {
    const payload = {
      applicationType: 'cdo',
      'cdoIssued-day': '10',
      'cdoIssued-month': '10',
      'cdoIssued-year': '2020',
      dogId: 2
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/application-type',
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

  test('POST /cdo/create/application-type route with invalid payload should show errors', async () => {
    const options = {
      method: 'POST',
      url: '/cdo/create/application-type',
      auth,
      payload: {}
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(400)
    expect(setDog).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()
    expect(document.querySelectorAll('.govuk-error-summary li').length).toBe(1)

    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())

    expect(messages).toContain('Application type is required')
  })

  test('POST /cdo/create/application-type route with invalid date should display error', async () => {
    const options = {
      method: 'POST',
      url: '/cdo/create/application-type',
      auth,
      payload: {
        applicationType: 'cdo',
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

    expect(messages).toContain('Enter a real date')
  })

  test('POST /cdo/create/application-type route with cdo future date should display error', async () => {
    const options = {
      method: 'POST',
      url: '/cdo/create/application-type',
      auth,
      payload: {
        applicationType: 'cdo',
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

    expect(messages).toContain('Enter a date that is today or in the past')
  })

  test('POST /cdo/create/application-type missing day should display error', async () => {
    const options = {
      method: 'POST',
      url: '/cdo/create/application-type',
      auth,
      payload: {
        applicationType: 'cdo',
        'cdoIssued-year': '2021'
      }
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(400)
    expect(setDog).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())

    expect(messages).toContain('A CDO issue date must include a day and month')
  })

  test('POST /cdo/create/application-type missing day should display error', async () => {
    const options = {
      method: 'POST',
      url: '/cdo/create/application-type',
      auth,
      payload: {
        applicationType: 'cdo',
        'cdoIssued-month': '01',
        'cdoIssued-year': '2021'
      }
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(400)
    expect(setDog).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())

    expect(messages).toContain('A CDO issue date must include a day')
  })

  test('POST /cdo/create/application-type missing month should display error', async () => {
    const options = {
      method: 'POST',
      url: '/cdo/create/application-type',
      auth,
      payload: {
        applicationType: 'cdo',
        'cdoIssued-day': '01',
        'cdoIssued-year': '2021'
      }
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(400)
    expect(setDog).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())

    expect(messages).toContain('A CDO issue date must include a month')
  })

  test('POST /cdo/create/application-type missing year should display error', async () => {
    const options = {
      method: 'POST',
      url: '/cdo/create/application-type',
      auth,
      payload: {
        applicationType: 'cdo',
        'cdoIssued-day': '01',
        'cdoIssued-month': '01'
      }
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(400)
    expect(setDog).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())

    expect(messages).toContain('A CDO issue date must include a year')
  })

  test('POST /cdo/create/application-type route with year less than 2020 should display error', async () => {
    const options = {
      method: 'POST',
      url: '/cdo/create/application-type',
      auth,
      payload: {
        applicationType: 'cdo',
        'cdoIssued-day': '01',
        'cdoIssued-month': '01',
        'cdoIssued-year': '2019'
      }
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(400)
    expect(setDog).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())

    expect(messages).toContain('The CDO issue year must be 2020 or later')
  })

  test('POST /cdo/create/application-type route with future interim date should display error', async () => {
    const options = {
      method: 'POST',
      url: '/cdo/create/application-type',
      auth,
      payload: {
        applicationType: 'interim-exemption',
        'interimExemption-day': '01',
        'interimExemption-month': '01',
        'interimExemption-year': '9999'
      }
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(400)
    expect(setDog).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())

    expect(messages).toContain('Enter a date that is today or in the past')
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
