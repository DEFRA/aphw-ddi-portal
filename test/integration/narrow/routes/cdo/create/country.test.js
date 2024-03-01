const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Manually select country', () => {
  jest.mock('../../../../../../app/api/ddi-index-api')
  const { getCountries } = require('../../../../../../app/api/ddi-index-api')

  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  // jest.mock('../../../../../../app/session/cdo/dog')
  // const { getDog, setDog } = require('../../../../../../app/session/cdo/dog')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    getCountries.mockResolvedValue([
      'England',
      'Scotland',
      'Wales'
    ])

    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/create/country route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/create/country',
      auth
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(200)
    expect(document.querySelector('.govuk-back-link').getAttribute('href')).toBe('/cdo/create/address')
    expect(document.querySelector('h1.govuk-heading-l').textContent).toBe('Select country')
    expect(document.querySelector('#main-content form .govuk-button').textContent).toContain('Continue')
    expect(document.querySelector('.govuk-select option[selected]').textContent).toBe('Choose country')
    expect(document.querySelectorAll('.govuk-select option')[1].textContent).toBe('England')
    // expect(document.querySelector('#breed').hasAttribute('checked')).toBeTruthy()
    // expect(document.querySelector('#name').getAttribute('value')).toBe('Bruce')
    // expect(document.querySelector('#cdoIssued-day').getAttribute('value')).toBe('10')
    // expect(document.querySelector('#cdoIssued-month').getAttribute('value')).toBe('10')
    // expect(document.querySelector('#cdoIssued-year').getAttribute('value')).toBe('2020')
  })

  // test('GET /cdo/create/dog-details route returns 404 if no dog in session', async () => {
  //   getDog.mockReturnValue(undefined)
  //
  //   const options = {
  //     method: 'GET',
  //     url: '/cdo/create/dog-details',
  //     auth
  //   }
  //
  //   const response = await server.inject(options)
  //
  //   expect(response.statusCode).toBe(404)
  // })
  //
  // test('GET /cdo/create/owner-details route returns 302 if not auth', async () => {
  //   const options = {
  //     method: 'GET',
  //     url: '/cdo/create/dog-details'
  //   }
  //
  //   const response = await server.inject(options)
  //   expect(response.statusCode).toBe(302)
  // })

  // test('POST /cdo/create/dog-details route with valid CDO payload returns 302', async () => {
  //   const payload = {
  //     breed: 'Breed 1',
  //     name: 'Bruce',
  //     applicationType: 'cdo',
  //     'cdoIssued-day': '10',
  //     'cdoIssued-month': '10',
  //     'cdoIssued-year': '2020'
  //   }
  //
  //   const options = {
  //     method: 'POST',
  //     url: '/cdo/create/dog-details',
  //     auth,
  //     headers: {
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     payload: querystring.stringify(payload)
  //   }
  //
  //   const response = await server.inject(options)
  //
  //   expect(response.statusCode).toBe(302)
  //   expect(setDog).toHaveBeenCalledTimes(1)
  //   expect(setDog).toHaveBeenCalledWith(expect.anything(), {
  //     breed: 'Breed 1',
  //     name: 'Bruce',
  //     applicationType: 'cdo',
  //     interimExemption: null,
  //     cdoIssued: new UTCDate('2020-10-10T00:00:00.000Z'),
  //     cdoExpiry: new UTCDate('2020-12-10T00:00:00.000Z')
  //   })
  //   expect(response.headers.location).toContain('/cdo/create/confirm-dog-details')
  // })
  //
  // test('POST /cdo/create/dog-details route with valid interim scheme payload returns 302', async () => {
  //   const today = new Date(new Date().toDateString())
  //
  //   const payload = {
  //     breed: 'Breed 1',
  //     name: 'Bruce',
  //     applicationType: 'interim-exemption',
  //     'interimExemption-day': today.getDate(),
  //     'interimExemption-month': today.getMonth() + 1,
  //     'interimExemption-year': today.getFullYear()
  //   }
  //
  //   const options = {
  //     method: 'POST',
  //     url: '/cdo/create/dog-details',
  //     auth,
  //     headers: {
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     payload: querystring.stringify(payload)
  //   }
  //
  //   const response = await server.inject(options)
  //
  //   expect(response.statusCode).toBe(302)
  //   expect(setDog).toHaveBeenCalledTimes(1)
  //   expect(setDog).toHaveBeenCalledWith(expect.anything(), {
  //     breed: 'Breed 1',
  //     name: 'Bruce',
  //     applicationType: 'interim-exemption',
  //     interimExemption: today,
  //     cdoIssued: null,
  //     cdoExpiry: null
  //   })
  //   expect(response.headers.location).toContain('/cdo/create/confirm-dog-details')
  // })
  //
  // test('POST /cdo/create/dog-details route with invalid dog id returns 400', async () => {
  //   const payload = {
  //     breed: 'Breed 1',
  //     name: 'Bruce',
  //     applicationType: 'cdo',
  //     'cdoIssued-day': '10',
  //     'cdoIssued-month': '10',
  //     'cdoIssued-year': '2020',
  //     dogId: 2
  //   }
  //
  //   const options = {
  //     method: 'POST',
  //     url: '/cdo/create/dog-details',
  //     auth,
  //     headers: {
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     payload: querystring.stringify(payload)
  //   }
  //
  //   setDog.mockImplementation(() => {
  //     const error = new Error('Dog not found')
  //
  //     error.type = 'DOG_NOT_FOUND'
  //
  //     throw error
  //   })
  //
  //   const response = await server.inject(options)
  //
  //   expect(response.statusCode).toBe(400)
  //   expect(setDog).toHaveBeenCalledTimes(1)
  // })
  //
  // test('POST /cdo/create/dog-details route with invalid payload should show errors', async () => {
  //   const options = {
  //     method: 'POST',
  //     url: '/cdo/create/dog-details',
  //     auth,
  //     payload: {}
  //   }
  //
  //   const response = await server.inject(options)
  //
  //   const { document } = new JSDOM(response.payload).window
  //
  //   expect(response.statusCode).toBe(400)
  //   expect(setDog).not.toHaveBeenCalled()
  //   expect(document.querySelector('.govuk-error-summary')).not.toBeNull()
  //   expect(document.querySelectorAll('.govuk-error-summary li').length).toBe(2)
  //
  //   const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())
  //
  //   expect(messages).toContain('Breed type is required')
  //   expect(messages).toContain('Application type is required')
  // })
  //
  // test('POST /cdo/create/dog-details route with invalid date should display error', async () => {
  //   const options = {
  //     method: 'POST',
  //     url: '/cdo/create/dog-details',
  //     auth,
  //     payload: {
  //       breed: 'Breed 1',
  //       name: 'Bruce',
  //       applicationType: 'cdo',
  //       'cdoIssued-day': '40',
  //       'cdoIssued-month': '10',
  //       'cdoIssued-year': '2021'
  //     }
  //   }
  //
  //   const response = await server.inject(options)
  //
  //   const { document } = new JSDOM(response.payload).window
  //
  //   expect(response.statusCode).toBe(400)
  //   expect(setDog).not.toHaveBeenCalled()
  //   expect(document.querySelector('.govuk-error-summary')).not.toBeNull()
  //
  //   const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())
  //
  //   expect(messages).toContain('Enter a real date')
  // })
  //
  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
