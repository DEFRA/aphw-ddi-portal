const { auth, user } = require('../../../../../mocks/auth')

const { JSDOM } = require('jsdom')

describe('Update owner details', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api')
  const { getCountries } = require('../../../../../../app/api/ddi-index-api')

  jest.mock('../../../../../../app/api/ddi-index-api/person')
  const { getPersonByReference, getPersonAndDogs, updatePersonAndForce } = require('../../../../../../app/api/ddi-index-api/person')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    updatePersonAndForce.mockResolvedValue({ policeForceResult: { changed: false } })

    getCountries.mockResolvedValue([
      'England',
      'Scotland',
      'Wales'
    ])

    getPersonAndDogs.mockResolvedValue({ dogs: [] })

    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/edit/owner-details/P-1234-5678 route returns 200', async () => {
    getPersonByReference.mockResolvedValue({
      firstName: 'John',
      lastName: 'Smith',
      birthDate: '1980-01-01',
      personReference: 'P-1234-5678',
      address: {
        addressLine1: '1 The Street',
        addressLine2: 'The Town',
        town: 'The City',
        postcode: 'AB12 3CD',
        country: 'England'
      },
      contacts: {
        emails: [
          'test@example.com'
        ],
        primaryTelephones: [
          '01234 567890'
        ],
        secondaryTelephones: [
          '01234 567890'
        ]
      }
    })

    const options = {
      method: 'GET',
      url: '/cdo/edit/owner-details/P-1234-5678',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
  })

  test('GET /cdo/edit/owner-details/P-1234-5678 route returns 404 when person not found', async () => {
    getPersonByReference.mockResolvedValue(null)

    const options = {
      method: 'GET',
      url: '/cdo/edit/owner-details/P-1234-5678',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(404)
  })

  test('POST /cdo/edit/owner-details route forwards to next screen', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: '1980-01-01',
      'dateOfBirth-day': '01',
      'dateOfBirth-month': '01',
      'dateOfBirth-year': '1980',
      personReference: 'P-1234-5678',
      addressLine1: '1 The Street',
      addressLine2: 'The Town',
      town: 'The City',
      postcode: 'AB12 3CD',
      country: 'England',
      email: 'test@example.com',
      primaryTelephone: '01235678901',
      secondaryTelephone: '01235678902'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(302)
    expect(updatePersonAndForce).toHaveBeenCalledTimes(1)
    expect(response.headers.location).toBe('/cdo/view/owner-details/P-1234-5678')
  })

  test('POST /cdo/edit/owner-details route forwards to police change screen', async () => {
    updatePersonAndForce.mockResolvedValue({ policeForceResult: { changed: true } })
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: '1980-01-01',
      'dateOfBirth-day': '01',
      'dateOfBirth-month': '01',
      'dateOfBirth-year': '1980',
      personReference: 'P-1234-5678',
      addressLine1: '1 The Street',
      addressLine2: 'The Town',
      town: 'The City',
      postcode: 'AB12 3CD',
      country: 'England',
      email: 'test@example.com',
      primaryTelephone: '01235678901',
      secondaryTelephone: '01235678902'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(302)
    expect(updatePersonAndForce).toHaveBeenCalledTimes(1)
    expect(response.headers.location).toBe('/cdo/edit/police-force-changed')
  })

  test('POST /cdo/edit/owner-details route returns 400 when payload is invalid', async () => {
    const options = {
      method: 'POST',
      url: '/cdo/edit/owner-details',
      auth,
      payload: {}
    }

    const response = await server.inject(options)

    const { document } = (new JSDOM(response.payload)).window

    expect(response.statusCode).toBe(400)
    expect(updatePersonAndForce).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()
  })

  test('POST /cdo/edit/owner-details with invalid phone number returns 400', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: '1980-01-01',
      personReference: 'P-1234-5678',
      addressLine1: '1 The Street',
      addressLine2: 'The Town',
      town: 'The City',
      postcode: 'AB12 3CD',
      country: 'England',
      email: 'test@example.com',
      primaryTelephone: '1234'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)

    const { document } = (new JSDOM(response.payload)).window

    expect(response.statusCode).toBe(400)
    expect(updatePersonAndForce).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())

    expect(messages).toContain('Telephone number must be real')
  })

  test('POST /cdo/edit/owner-details with invalid dob returns 400', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      'dateOfBirth-day': '40',
      'dateOfBirth-month': '1',
      'dateOfBirth-year': '1980',
      personReference: 'P-1234-5678',
      addressLine1: '1 The Street',
      addressLine2: 'The Town',
      town: 'The City',
      postcode: 'AB12 3CD',
      country: 'England',
      email: 'test@example.com'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)

    const { document } = (new JSDOM(response.payload)).window

    expect(response.statusCode).toBe(400)
    expect(updatePersonAndForce).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())

    expect(messages).toContain('Date must be a real date')
  })

  test('POST /cdo/edit/owner-details with invalid dob (short year) returns 400', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      'dateOfBirth-day': '40',
      'dateOfBirth-month': '1',
      'dateOfBirth-year': '198',
      personReference: 'P-1234-5678',
      addressLine1: '1 The Street',
      addressLine2: 'The Town',
      town: 'The City',
      postcode: 'AB12 3CD',
      country: 'England',
      email: 'test@example.com'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)

    const { document } = (new JSDOM(response.payload)).window

    expect(response.statusCode).toBe(400)
    expect(updatePersonAndForce).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())

    expect(messages).toContain('Year must include four numbers')
  })

  test('POST /cdo/edit/owner-details with future dob returns 400', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      'dateOfBirth-day': '1',
      'dateOfBirth-month': '1',
      'dateOfBirth-year': '9999',
      personReference: 'P-1234-5678',
      addressLine1: '1 The Street',
      addressLine2: 'The Town',
      town: 'The City',
      postcode: 'AB12 3CD',
      country: 'England',
      email: 'test@example.com'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)

    const { document } = (new JSDOM(response.payload)).window

    expect(response.statusCode).toBe(400)
    expect(updatePersonAndForce).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())

    expect(messages).toContain('Date of birth must be in the past')
  })

  test('POST /cdo/edit/owner-details with missing year returns 400', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      'dateOfBirth-day': '1',
      'dateOfBirth-month': '1',
      'dateOfBirth-year': '',
      personReference: 'P-1234-5678',
      addressLine1: '1 The Street',
      addressLine2: 'The Town',
      town: 'The City',
      postcode: 'AB12 3CD',
      country: 'England',
      email: 'test@example.com'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)

    const { document } = (new JSDOM(response.payload)).window

    expect(response.statusCode).toBe(400)
    expect(updatePersonAndForce).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())
    expect(messages).toContain('Date of birth must include a year')
  })

  test('POST /cdo/edit/owner-details with missing month and year returns 400', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      'dateOfBirth-day': '1',
      'dateOfBirth-month': '',
      'dateOfBirth-year': '',
      personReference: 'P-1234-5678',
      addressLine1: '1 The Street',
      addressLine2: 'The Town',
      town: 'The City',
      postcode: 'AB12 3CD',
      country: 'England',
      email: 'test@example.com'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)

    const { document } = (new JSDOM(response.payload)).window

    expect(response.statusCode).toBe(400)
    expect(updatePersonAndForce).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())
    expect(messages).toContain('Date of birth must include a month and year')
  })

  test('POST /cdo/edit/owner-details with invalid email returns 400', async () => {
    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      'dateOfBirth-day': '1',
      'dateOfBirth-month': '',
      'dateOfBirth-year': '',
      personReference: 'P-1234-5678',
      addressLine1: '1 The Street',
      addressLine2: 'The Town',
      town: 'The City',
      postcode: 'AB12 3CD',
      country: 'England',
      email: 'invalid'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)

    const { document } = (new JSDOM(response.payload)).window

    expect(response.statusCode).toBe(400)
    expect(updatePersonAndForce).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())
    expect(messages).toContain('Email address must be real')
  })

  test('POST /cdo/edit/owner-details with invalid breed for country returns 400', async () => {
    getPersonAndDogs.mockResolvedValue({ dogs: [{ breed: 'XL Bully' }] })

    const payload = {
      firstName: 'John',
      lastName: 'Smith',
      'dateOfBirth-day': '1',
      'dateOfBirth-month': '1',
      'dateOfBirth-year': '2000',
      personReference: 'P-1234-5678',
      addressLine1: '1 The Street',
      addressLine2: 'The Town',
      town: 'The City',
      postcode: 'AB12 3CD',
      country: 'Scotland',
      email: 'me@here.com'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)

    const { document } = (new JSDOM(response.payload)).window

    expect(response.statusCode).toBe(400)
    expect(updatePersonAndForce).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())
    expect(messages).toContain('Address for an XL Bully must be in England or Wales')
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
