const { auth, user } = require('../../../../../mocks/auth')
const FormData = require('form-data')

describe('SelectAddress edit test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/lib/back-helpers')
  const { addBackNavigation, getMainReturnPoint } = require('../../../../../../app/lib/back-helpers')

  jest.mock('../../../../../../app/session/session-wrapper')
  const { getFromSession } = require('../../../../../../app/session/session-wrapper')

  jest.mock('../../../../../../app/session/cdo/owner')
  const { getPostcodeLookupDetails, setAddress } = require('../../../../../../app/session/cdo/owner')

  jest.mock('../../../../../../app/api/os-places')
  const { getPostcodeAddresses } = require('../../../../../../app/api/os-places')

  jest.mock('../../../../../../app/api/ddi-index-api/person')
  const { updatePerson, getPersonByReference } = require('../../../../../../app/api/ddi-index-api/person')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    addBackNavigation.mockReturnValue({ backLink: '/back' })
    getPostcodeAddresses.mockResolvedValue([{ addressLine1: 'line1' }])
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/edit/select-address route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/edit/select-address',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /cdo/edit/select-address route returns 200 with lowercase postcode', async () => {
    getPostcodeLookupDetails.mockReturnValue({ postcode: 'ts1 1ts', houseNumber: 'house1' })

    const options = {
      method: 'GET',
      url: '/cdo/edit/select-address',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(getPostcodeAddresses).toHaveBeenCalledWith('TS1 1TS', 'house1')
  })

  test('GET /cdo/edit/select-address route returns 200 even when no addresses', async () => {
    getPostcodeAddresses.mockResolvedValue(null)

    const options = {
      method: 'GET',
      url: '/cdo/edit/select-address',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('POST /cdo/edit/select-address route returns 302 if not auth', async () => {
    const fd = new FormData()
    fd.append('firstName', 'John')
    fd.append('lastName', 'Smith')

    const options = {
      method: 'POST',
      url: '/cdo/edit/select-address',
      headers: fd.getHeaders(),
      payload: fd.getBuffer()
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('POST /cdo/edit/select-address with valid data returns 302', async () => {
    const nextScreenUrl = '/main-return-point'

    getMainReturnPoint.mockReturnValue('/main-return-point')
    getFromSession.mockReturnValue([{ addressLine1: 'addr1', addressLine2: 'addr2', town: 'town', postcode: 'AB1 1TT', country: 'E' }])
    const payload = {
      address: 0
    }
    updatePerson.mockResolvedValue()
    getPostcodeLookupDetails.mockReturnValue({ personReference: 'P-123' })
    getPersonByReference.mockResolvedValue({ personReference: 'P-123', address: { } })

    const options = {
      method: 'POST',
      url: '/cdo/edit/select-address',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(nextScreenUrl)
  })

  test('POST /cdo/edit/select-address with invalid data returns error', async () => {
    getFromSession.mockReturnValue([{ addressLine1: 'addr1', addressLine2: 'addr2', town: 'town', postcode: 'AB1 1TT', country: 'E' }])
    const payload = {
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/select-address',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
  })

  test('GET /cdo/edit/select-address route stores address in session when only one address', async () => {
    getPostcodeAddresses.mockResolvedValue([
      { addressLine1: 'addr1', addressLine2: 'addr2', town: 'town', postcode: 'AB1 1TT', country: 'England' }
    ])

    const options = {
      method: 'GET',
      url: '/cdo/edit/select-address',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(setAddress).toHaveBeenCalledTimes(1)
  })

  test('GET /cdo/edit/select-address route doesnt store address in session when multiple addresses', async () => {
    getPostcodeAddresses.mockResolvedValue([
      { addressLine1: 'addr1', addressLine2: 'addr2', town: 'town', postcode: 'AB1 1TT', country: 'England' },
      { addressLine1: 'addr1_2', addressLine2: 'addr2_2', town: 'town_2', postcode: 'AB1 1TT_2', country: 'England_2' }
    ])

    const options = {
      method: 'GET',
      url: '/cdo/edit/select-address',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(setAddress).not.toHaveBeenCalled()
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
