const { auth, user } = require('../../../../../mocks/auth')
const FormData = require('form-data')
const { routes } = require('../../../../../../app/constants/cdo/dog')
const { getFromSession } = require('../../../../../../app/session/session-wrapper')
jest.mock('../../../../../../app/session/session-wrapper')
const { setAddress } = require('../../../../../../app/session/cdo/owner')
const { JSDOM } = require('jsdom')
jest.mock('../../../../../../app/session/cdo/owner')

describe('SelectAddress test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/os-places')
  const { getPostcodeAddresses } = require('../../../../../../app/api/os-places')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    setAddress.mockReturnValue()
    getPostcodeAddresses.mockResolvedValue([{ addressLine1: 'addr1', postcode: 'postcode' }])
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/create/select-address route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/create/select-address',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
  })

  test('GET /cdo/create/select-address route returns 200 even when no addresses', async () => {
    getPostcodeAddresses.mockResolvedValue(null)

    const options = {
      method: 'GET',
      url: '/cdo/create/select-address',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(setAddress).not.toHaveBeenCalled()
  })

  test('GET /cdo/create/select-address route stores address in session when only one address', async () => {
    getPostcodeAddresses.mockResolvedValue([
      { addressLine1: 'addr1', addressLine2: 'addr2', town: 'town', postcode: 'AB1 1TT', country: 'England' }
    ])

    const options = {
      method: 'GET',
      url: '/cdo/create/select-address',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(setAddress).toHaveBeenCalledTimes(1)
  })

  test('GET /cdo/create/select-address route doesnt store address in session when multiple addresses', async () => {
    getPostcodeAddresses.mockResolvedValue([
      { addressLine1: 'addr1', addressLine2: 'addr2', town: 'town', postcode: 'AB1 1TT', country: 'England' },
      { addressLine1: 'addr1_2', addressLine2: 'addr2_2', town: 'town_2', postcode: 'AB1 1TT_2', country: 'England_2' }
    ])

    const options = {
      method: 'GET',
      url: '/cdo/create/select-address',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const { document } = new JSDOM(response.payload).window
    expect(setAddress).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-link[data-testid="change-postcode-link"]').getAttribute('href')).toBe('/cdo/create/postcode-lookup')
    expect(document.querySelector('.govuk-back-link').getAttribute('href')).toBe('/cdo/create/postcode-lookup')
  })

  test('GET /cdo/create/select-address route returns 200 even when no addresses', async () => {
    getPostcodeAddresses.mockResolvedValue(null)

    const options = {
      method: 'GET',
      url: '/cdo/create/select-address',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(setAddress).not.toHaveBeenCalled()
  })

  test('POST /cdo/create/select-address route returns 302 if not auth', async () => {
    const fd = new FormData()
    fd.append('firstName', 'John')
    fd.append('lastName', 'Smith')

    const options = {
      method: 'POST',
      url: '/cdo/create/select-address',
      headers: fd.getHeaders(),
      payload: fd.getBuffer()
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('POST /cdo/create/select-address with valid data returns 302', async () => {
    const nextScreenUrl = routes.microchipSearch.get
    getFromSession.mockReturnValue([{ addressLine1: 'addr1', addressLine2: 'addr2', town: 'town', postcode: 'AB1 1TT', country: 'England' }])
    const payload = {
      address: 0
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/select-address',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(nextScreenUrl)
  })

  test('POST /cdo/create/select-address with invalid data returns error', async () => {
    getFromSession.mockReturnValue([{ addressLine1: 'addr1', addressLine2: 'addr2', town: 'town', postcode: 'AB1 1TT', country: 'England' }])
    const payload = {
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/select-address',
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
