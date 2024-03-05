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
  const { getAddress, setAddress } = require('../../../../../../app/session/cdo/owner')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    getCountries.mockResolvedValue([
      'England',
      'Scotland',
      'Wales'
    ])

    getAddress.mockReturnValue({})

    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/create/address route returns 200', async () => {
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
    expect(document.querySelectorAll('.govuk-error-summary__list a')[0].textContent.trim()).toBe('Enter the first line of the address')
    expect(document.querySelectorAll('.govuk-error-summary__list a')[1].textContent.trim()).toBe('Enter the town or city')
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
    const nextScreenUrl = routes.details.get

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

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
