const { auth, user } = require('../../../../../mocks/auth')
const FormData = require('form-data')
const { JSDOM } = require('jsdom')
const { countries: mockCountries } = require('../../../../../mocks/countries')

describe('Address edit test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/person')
  const { getPersonByReference, getPersonAndDogs, updatePersonAndForce } = require('../../../../../../app/api/ddi-index-api/person')

  jest.mock('../../../../../../app/api/ddi-index-api/countries')
  const { getCountries } = require('../../../../../../app/api/ddi-index-api/countries')

  jest.mock('../../../../../../app/lib/back-helpers')
  const { getMainReturnPoint } = require('../../../../../../app/lib/back-helpers')

  jest.mock('../../../../../../app/session/cdo/owner')
  const { getAddress } = require('../../../../../../app/session/cdo/owner')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    getMainReturnPoint.mockReturnValue('')
    getCountries.mockResolvedValue(mockCountries)
    updatePersonAndForce.mockResolvedValue({ policeForceResult: { changed: false } })
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/edit/address route returns 200 when data from DB', async () => {
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
    expect(getPersonByReference).toHaveBeenCalled()
    expect(getAddress).not.toHaveBeenCalled()
  })

  test('GET /cdo/edit/address route returns 200 when data from DB when param supplied with value not equal session', async () => {
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
      url: '/cdo/edit/address/P-123/db',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(getPersonByReference).toHaveBeenCalled()
    expect(getAddress).not.toHaveBeenCalled()
  })

  test('GET /cdo/edit/address route returns 200 when data from session', async () => {
    getAddress.mockReturnValue({
      addressLine1: '',
      addressLine2: '',
      town: '',
      postcode: ''
    })

    const options = {
      method: 'GET',
      url: '/cdo/edit/address/P-123/session',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(getAddress).toHaveBeenCalled()
    expect(getPersonByReference).not.toHaveBeenCalled()
  })

  test('GET /cdo/edit/address route returns 404 when person not found', async () => {
    getPersonByReference.mockResolvedValue(null)

    const options = {
      method: 'GET',
      url: '/cdo/edit/address/P-123',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
  })

  test('POST /cdo/edit/address route returns 302 if not auth', async () => {
    const fd = new FormData()

    const options = {
      method: 'POST',
      url: '/cdo/edit/address/P-123',
      headers: fd.getHeaders(),
      payload: fd.getBuffer()
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('POST /cdo/edit/address with invalid data returns error', async () => {
    getPersonByReference.mockResolvedValue({
      personReference: 'P-123',
      address: {
        addressLine1: '',
        addressLine2: '',
        town: '',
        postcode: ''
      }
    })

    const payload = {
      addressLine2: 'locality',
      postcode: 'AB1 1TT'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/address/P-123',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelectorAll('.govuk-error-message')[0].textContent.trim()).toBe('Error: Enter first line of address')
  })

  test('POST /cdo/edit/address with valid data but missing person returns 404', async () => {
    getPersonByReference.mockResolvedValue(null)

    const payload = {
      personReference: 'P-123',
      addressLine1: '1 Testing Street',
      town: 'Testington',
      postcode: 'AB1 1TT',
      country: 'Wales'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/address/P-123',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
  })

  test('POST /cdo/edit/address with valid data forwards to next screen', async () => {
    const nextScreenUrl = '/main-return-point'
    getMainReturnPoint.mockReturnValue(nextScreenUrl)

    getPersonByReference.mockResolvedValue({
      personReference: 'P-123',
      address: {
        addressLine1: '',
        addressLine2: '',
        town: '',
        postcode: ''
      }
    })

    getPersonAndDogs.mockResolvedValue({
      dogs: []
    })

    const payload = {
      personReference: 'P-123',
      addressLine1: '1 Testing Street',
      town: 'Testington',
      postcode: 'AB1 1TT',
      country: 'Wales'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/address/P-123',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(nextScreenUrl)
  })

  test('POST /cdo/edit/address with valid data and police change forwards to police changed screen', async () => {
    const nextScreenUrl = '/cdo/edit/police-force-changed'
    getMainReturnPoint.mockReturnValue(nextScreenUrl)
    updatePersonAndForce.mockResolvedValue({ policeForceResult: { changed: true } })

    getPersonByReference.mockResolvedValue({
      personReference: 'P-123',
      address: {
        addressLine1: '',
        addressLine2: '',
        town: '',
        postcode: ''
      }
    })

    getPersonAndDogs.mockResolvedValue({
      dogs: []
    })

    const payload = {
      personReference: 'P-123',
      addressLine1: '1 Testing Street',
      town: 'Testington',
      postcode: 'AB1 1TT',
      country: 'Wales'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/address/P-123',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(nextScreenUrl)
  })

  test('POST /cdo/edit/address with valid data and police force not found forwards to force-not-found', async () => {
    const nextScreenUrl = '/cdo/edit/police-force-not-found/P-123'
    getMainReturnPoint.mockReturnValue(nextScreenUrl)
    updatePersonAndForce.mockResolvedValue({ policeForceResult: { changed: false, reason: 'Not found' } })

    getPersonByReference.mockResolvedValue({
      personReference: 'P-123',
      address: {
        addressLine1: '',
        addressLine2: '',
        town: '',
        postcode: ''
      }
    })

    getPersonAndDogs.mockResolvedValue({
      dogs: []
    })

    const payload = {
      personReference: 'P-123',
      addressLine1: '1 Testing Street',
      town: 'Testington',
      postcode: 'AB1 1TT',
      country: 'Wales'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/address/P-123',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(nextScreenUrl)
  })

  test('POST /cdo/edit/address errors if address is Scotland and owner has one or more XL Bullies', async () => {
    const nextScreenUrl = '/main-return-point'
    getMainReturnPoint.mockReturnValue(nextScreenUrl)

    getPersonByReference.mockResolvedValue({
      personReference: 'P-123',
      address: {
        addressLine1: '',
        addressLine2: '',
        town: '',
        postcode: ''
      }
    })

    getPersonAndDogs.mockResolvedValue({
      dogs: [{
        breed: 'XL Bully'
      }]
    })

    const payload = {
      personReference: 'P-123',
      addressLine1: '1 Testing Street',
      town: 'Testington',
      postcode: 'AB1 1TT',
      country: 'Scotland'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/address/P-123',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelectorAll('.govuk-error-message')[0].textContent.trim()).toBe('Error: Address for an XL Bully must be in England or Wales')
  })

  test('POST /cdo/edit/address forwards to next screen if address is Scotland but owner doesnt have XL Bullies', async () => {
    const nextScreenUrl = '/main-return-point'
    getMainReturnPoint.mockReturnValue(nextScreenUrl)

    getPersonByReference.mockResolvedValue({
      personReference: 'P-123',
      address: {
        addressLine1: '',
        addressLine2: '',
        town: '',
        postcode: ''
      }
    })

    getPersonAndDogs.mockResolvedValue({
      dogs: [{
        breed: 'Breed 1'
      }]
    })

    const payload = {
      personReference: 'P-123',
      addressLine1: '1 Testing Street',
      town: 'Testington',
      postcode: 'AB1 1TT',
      country: 'Scotland'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/address/P-123',
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
