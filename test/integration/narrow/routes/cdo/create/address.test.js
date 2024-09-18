const { auth, user } = require('../../../../../mocks/auth')
const FormData = require('form-data')
const { routes } = require('../../../../../../app/constants/cdo/dog')
const { JSDOM } = require('jsdom')

describe('Address test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api')
  const { getCountries } = require('../../../../../../app/api/ddi-index-api')

  jest.mock('../../../../../../app/session/cdo/owner')
  const { getAddress, setAddress, setEnforcementDetails } = require('../../../../../../app/session/cdo/owner')

  jest.mock('../../../../../../app/session/routes')
  const { isRouteFlagSet } = require('../../../../../../app/session/routes')

  jest.mock('../../../../../../app/api/police-area')
  const { matchPoliceForceByName, lookupPoliceForceByPostcode } = require('../../../../../../app/api/police-area')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    getCountries.mockResolvedValue([
      'England',
      'Scotland',
      'Wales'
    ])

    getAddress.mockReturnValue({ country: 'England' })
    matchPoliceForceByName.mockResolvedValue()
    lookupPoliceForceByPostcode.mockResolvedValue()

    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/create/address route returns 200 - back link standard', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/create/address',
      auth
    }

    const response = await server.inject(options)
    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(200)

    expect(getCountries).toBeCalled()

    expect(document.querySelectorAll('.govuk-select option')[1].textContent).toBe('England')
    expect(document.querySelector('.govuk-back-link').getAttribute('href')).toBe('/cdo/create/postcode-lookup')
  })

  test('GET /cdo/create/address route returns 200 - back link select owner', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/create/address',
      auth
    }

    isRouteFlagSet.mockReturnValue(true)

    const response = await server.inject(options)
    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(200)

    expect(getCountries).toBeCalled()

    expect(document.querySelectorAll('.govuk-select option')[1].textContent).toBe('England')
    expect(document.querySelector('.govuk-back-link').getAttribute('href')).toBe('/cdo/create/select-owner')
  })

  test('GET /cdo/create/address route returns 200 - back link to summary', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/create/address?fromSummary=true',
      auth
    }

    const response = await server.inject(options)
    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(200)

    expect(getCountries).toBeCalled()

    expect(document.querySelectorAll('.govuk-select option')[1].textContent).toBe('England')
    expect(document.querySelector('.govuk-back-link').getAttribute('href')).toBe('/cdo/create/full-summary')
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

  test('POST /cdo/create/address with empty data returns error', async () => {
    const options = {
      method: 'POST',
      url: '/cdo/create/address',
      auth,
      payload: {}
    }

    const response = await server.inject(options)
    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(400)
    expect(document.querySelector('.govuk-error-summary__list')).not.toBeNull()
    expect(document.querySelectorAll('.govuk-error-summary__list a').length).toBe(4)
    expect(document.querySelectorAll('.govuk-error-summary__list a')[0].textContent.trim()).toBe('Enter first line of address')
    expect(document.querySelectorAll('.govuk-error-summary__list a')[1].textContent.trim()).toBe('Enter town or city')
    expect(document.querySelectorAll('.govuk-error-summary__list a')[2].textContent.trim()).toBe('Enter a postcode')
    expect(document.querySelectorAll('.govuk-error-summary__list a')[3].textContent.trim()).toBe('Select a country')
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

  test('POST /cdo/create/address without country returns error', async () => {
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
    expect(response.statusCode).toBe(400)
    const { document } = new JSDOM(response.payload).window
    expect(document.querySelectorAll('#country-error')[0].textContent).toContain('Select a country')
  })

  test('POST /cdo/create/address with valid data forwards to next screen', async () => {
    const nextScreenUrl = routes.microchipSearch.get

    const payload = {
      addressLine1: '1 Testing Street',
      town: 'Testington',
      postcode: 'AB1 1TT',
      country: 'England'
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
    expect(setAddress).toBeCalledWith(expect.anything(), {
      addressLine1: '1 Testing Street',
      town: 'Testington',
      postcode: 'AB1 1TT',
      country: 'England'
    })
  })

  test('POST /cdo/create/address with Scotland address forwards to next screen', async () => {
    const nextScreenUrl = routes.microchipSearch.get

    getAddress.mockReturnValue({ country: 'Scotland' })
    matchPoliceForceByName.mockResolvedValue({ id: 123 })

    const payload = {
      addressLine1: '1 Testing Street',
      town: 'Testington',
      postcode: 'EH1 1AQ',
      country: 'Scotland'
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
    expect(setAddress).toBeCalledWith(expect.anything(), {
      addressLine1: '1 Testing Street',
      town: 'Testington',
      postcode: 'EH1 1AQ',
      country: 'Scotland'
    })
    expect(setEnforcementDetails).toBeCalledWith(expect.anything(), { policeForce: 123 })
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
