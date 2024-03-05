const { auth, user } = require('../../../../../mocks/auth')
const FormData = require('form-data')
const { countries: mockCountries } = require('../../../../../mocks/countries')

describe('Address edit test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/person')
  const { getPersonByReference } = require('../../../../../../app/api/ddi-index-api/person')

  jest.mock('../../../../../../app/api/ddi-index-api/countries')
  const { getCountries } = require('../../../../../../app/api/ddi-index-api/countries')

  jest.mock('../../../../../../app/lib/back-helpers')
  const { getMainReturnPoint } = require('../../../../../../app/lib/back-helpers')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    getMainReturnPoint.mockReturnValue('')
    getCountries.mockResolvedValue(mockCountries)
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/edit/address route returns 200', async () => {
    getPersonByReference.mockResolvedValue({
      personReference: 'P-123',
      address: {
        addressLine1: '',
        addressLine2: '',
        town: '',
        postcode: ''
      }
    })

    const options = {
      method: 'GET',
      url: '/cdo/edit/address/P-123',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
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

  test('POST /cdo/create/address with valid data forwards to next screen', async () => {
    const nextScreenUrl = '/main-return-point'
    getMainReturnPoint.mockReturnValue(nextScreenUrl)

    const payload = {
      personReference: 'P-123',
      addressLine1: '1 Testing Street',
      town: 'Testington',
      postcode: 'AB1 1TT',
      country: 'Wales'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/address',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(nextScreenUrl)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
