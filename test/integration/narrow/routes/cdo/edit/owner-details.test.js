const { admin } = require('../../../../../../app/auth/permissions')
const { JSDOM } = require('jsdom')

describe('Update owner details', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api')
  const { getCountries } = require('../../../../../../app/api/ddi-index-api')

  jest.mock('../../../../../../app/api/ddi-index-api/person')
  const { getPersonByReference, updatePerson } = require('../../../../../../app/api/ddi-index-api/person')

  const createServer = require('../../../../../../app/server')
  let server

  const auth = { strategy: 'session-auth', credentials: { scope: [admin] } }

  const user = {
    userId: '1',
    username: 'test@example.com'
  }

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

  test('POST /cdo/edit/owner-details route returns 302', async () => {
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
      primaryTelephone: '01234 567890',
      secondaryTelephone: '01234 567890'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/owner-details',
      auth,
      payload
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(302)
    expect(updatePerson).toHaveBeenCalledTimes(1)
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
    expect(updatePerson).not.toHaveBeenCalled()
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
    expect(updatePerson).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())

    expect(messages).toContain('Enter a real telephone number')
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
    expect(updatePerson).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())

    expect(messages).toContain('Enter a real date')
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
    expect(updatePerson).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())

    expect(messages).toContain('Enter a 4-digit year')
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
    expect(updatePerson).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())

    expect(messages).toContain('Enter a date of birth that is in the past')
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
    expect(updatePerson).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())
    expect(messages).toContain('An owner date of birth must include a year')
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
    expect(updatePerson).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())
    expect(messages).toContain('An owner date of birth must include a month and year')
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
    expect(updatePerson).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()

    const messages = [...document.querySelectorAll('.govuk-error-summary li a')].map(el => el.textContent.trim())
    expect(messages).toContain('Enter a real email address')
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
