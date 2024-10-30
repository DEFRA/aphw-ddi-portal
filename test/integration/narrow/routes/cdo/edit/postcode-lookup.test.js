const { auth, user } = require('../../../../../mocks/auth')
const FormData = require('form-data')

describe('PostCode Lookup test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/person')
  const { getPersonByReference } = require('../../../../../../app/api/ddi-index-api/person')

  jest.mock('../../../../../../app/lib/back-helpers')
  const { addBackNavigation, addBackNavigationForErrorCondition } = require('../../../../../../app/lib/back-helpers')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    addBackNavigation.mockReturnValue({ backLink: '/back', srcHashParam: '?src=src-hash-param' })
    addBackNavigationForErrorCondition.mockReturnValue({ backLink: '/back', srcHashParam: '?src=src-hash-param' })
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/edit/postcode-lookup route returns 200', async () => {
    getPersonByReference.mockResolvedValue({ personReference: 'P-123' })

    const options = {
      method: 'GET',
      url: '/cdo/edit/postcode-lookup/P-123',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /cdo/edit/postcode-lookup route returns 302 and clears session', async () => {
    getPersonByReference.mockResolvedValue({ personReference: 'P-123' })

    const options = {
      method: 'GET',
      url: '/cdo/edit/postcode-lookup/P-123/clear?src=abc',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/cdo/edit/postcode-lookup/P-123?src=abc')
  })

  test('GET /cdo/edit/postcode-lookup route returns 404 when person not found', async () => {
    getPersonByReference.mockResolvedValue(null)

    const options = {
      method: 'GET',
      url: '/cdo/edit/postcode-lookup/P-123',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
  })

  test('POST /cdo/edit/postcode-lookup route returns 302 if not auth', async () => {
    getPersonByReference.mockResolvedValue({ personReference: 'P-123' })
    const fd = new FormData()
    fd.append('personReference', 'P-123')

    const options = {
      method: 'POST',
      url: '/cdo/edit/postcode-lookup',
      headers: fd.getHeaders(),
      payload: fd.getBuffer()
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('POST /cdo/edit/postcode-lookup with invalid data returns error', async () => {
    getPersonByReference.mockResolvedValue({ personReference: 'P-123' })

    const payload = {
      personReference: 'P-123'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/postcode-lookup',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
  })

  test('POST /cdo/edit/postcode-lookup with missing postcode returns error 1', async () => {
    getPersonByReference.mockResolvedValue({ personReference: 'P-123' })

    const payload = {
      personReference: 'P-123'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/postcode-lookup',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.result.indexOf('Enter a postcode')).toBeGreaterThan(-1)
  })

  test('POST /cdo/edit/postcode-lookup with empty postcode returns error 1', async () => {
    getPersonByReference.mockResolvedValue({ personReference: 'P-123' })

    const payload = {
      personReference: 'P-123',
      postcode: ''
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/postcode-lookup',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.result.indexOf('Enter a postcode')).toBeGreaterThan(-1)
  })

  test('POST /cdo/edit/postcode-lookup with invalid data and missing person returns 404', async () => {
    getPersonByReference.mockResolvedValue(null)

    const payload = {
      personReference: 'P-123'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/postcode-lookup',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
  })

  test('POST /cdo/edit/postcode-lookup with valid data forwards to next screen', async () => {
    getPersonByReference.mockResolvedValue({ personReference: 'P-123' })

    const nextScreenUrl = '/cdo/edit/select-address?src=src-hash-param'

    const payload = {
      personReference: 'P-123',
      postcode: 'AB1 1TT'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/postcode-lookup',
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
