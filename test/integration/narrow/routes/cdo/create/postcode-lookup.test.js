const { auth, user } = require('../../../../../mocks/auth')
const FormData = require('form-data')
const { JSDOM } = require('jsdom')

describe('PostCode Lookup test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/lib/back-helpers')
  const { addBackNavigation, addBackNavigationForErrorCondition } = require('../../../../../../app/lib/back-helpers')

  jest.mock('../../../../../../app/session/cdo/owner')
  const { getOwnerDetails, setOwnerDetails } = require('../../../../../../app/session/cdo/owner')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    addBackNavigation.mockReturnValue({ backLink: '/back', srcHashParam: '?src=src-hash-param' })
    addBackNavigationForErrorCondition.mockReturnValue({ backLink: '/back', srcHashParam: '?src=src-hash-param' })
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/create/postcode-lookup route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/create/postcode-lookup',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const { document } = new JSDOM(response.payload).window

    expect(document.querySelector('.govuk-back-link').getAttribute('href')).toBe('/cdo/create/owner-details')
  })

  test('POST /cdo/create/postcode-lookup route returns 302 if not auth', async () => {
    const fd = new FormData()

    const options = {
      method: 'POST',
      url: '/cdo/create/postcode-lookup',
      headers: fd.getHeaders(),
      payload: fd.getBuffer()
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('POST /cdo/create/postcode-lookup with missing postcode returns error 1', async () => {
    const payload = {
      houseNumber: '1'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/postcode-lookup',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.result.indexOf('Enter a postcode')).toBeGreaterThan(-1)
  })

  test('POST /cdo/create/postcode-lookup with empty postcode returns error 1', async () => {
    const payload = {
      houseNumber: '1',
      postcode: ''
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/postcode-lookup',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.result.indexOf('Enter a postcode')).toBeGreaterThan(-1)
  })

  test('POST /cdo/create/postcode-lookup with valid data forwards to next screen', async () => {
    const nextScreenUrl = '/cdo/create/select-address'

    const payload = {
      postcode: 'AB1 1TT'
    }

    getOwnerDetails.mockReturnValue({
      firstName: 'Cruella',
      lastName: 'de Vil'
    })

    const options = {
      method: 'POST',
      url: '/cdo/create/postcode-lookup',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(nextScreenUrl)
    expect(setOwnerDetails).toBeCalledWith(expect.anything(), {
      firstName: 'Cruella',
      lastName: 'de Vil',
      postcode: 'AB1 1TT'
    })
  })

  test('POST /cdo/create/postcode-lookup with all data forwards to next screen', async () => {
    const nextScreenUrl = '/cdo/create/select-address'

    const payload = {
      postcode: 'AB1 1TT',
      houseNumber: '2'
    }

    getOwnerDetails.mockReturnValue({
      firstName: 'Cruella',
      lastName: 'de Vil'
    })

    const options = {
      method: 'POST',
      url: '/cdo/create/postcode-lookup',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(nextScreenUrl)
    expect(setOwnerDetails).toBeCalledWith(expect.anything(), {
      firstName: 'Cruella',
      lastName: 'de Vil',
      postcode: 'AB1 1TT',
      houseNumber: '2'
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
