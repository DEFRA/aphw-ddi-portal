const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('View owner details', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/person')
  const { getPersonAndDogs } = require('../../../../../../app/api/ddi-index-api/person')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/view/owner-details route returns 200', async () => {
    getPersonAndDogs.mockResolvedValue({
      id: 1,
      firstName: 'Boris',
      lastName: 'MacClean',
      status: { status: 'TEST' },
      address: {
        addressLine1: '1 Test Street',
        addressLine2: 'Testarea',
        town: 'Testington'
      },
      contacts: [],
      dogs: [
        { name: 'Bruno' },
        { name: 'Fido' }
      ]
    })

    const options = {
      method: 'GET',
      url: '/cdo/view/owner-details/P-123',
      auth
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(200)
    const cards = document.querySelectorAll('.govuk-summary-card')
    expect(cards.length).toBe(3)
    expect(cards[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[0].textContent.trim()).toBe('Boris MacClean')
    expect(cards[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[2].textContent.trim().indexOf('1 Test Street')).toBeGreaterThan(-1)
    expect(cards[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[2].textContent.trim().indexOf('Testarea')).toBeGreaterThan(-1)
    expect(cards[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[2].textContent.trim().indexOf('Testington')).toBeGreaterThan(-1)
  })

  test('GET /cdo/view/owner-details throws if server error', async () => {
    getPersonAndDogs.mockImplementation(() => { throw new Error('dummy server error') })

    const options = {
      method: 'GET',
      url: '/cdo/view/owner-details/P-123',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(500)
  })

  test('GET /cdo/view/owner-details route with missing data returns 200 and not entered fields', async () => {
    getPersonAndDogs.mockResolvedValue({
      firstName: 'Wreck it',
      lastName: 'Ralph',
      birthDate: null,
      personReference: 'P-4813-BF4F',
      address: {
        addressLine1: '47 PARK STREET',
        addressLine2: null,
        town: 'LONDON',
        postcode: 'W1K 7EB',
        country: 'England'
      },
      contacts: [],
      dogs: [{
        id: 300242,
        indexNumber: 'ED300242',
        dogReference: '7f241e8f-1960-4375-92ff-cb40b172e4be',
        microchipNumber: null,
        microchipNumber2: null,
        breed: 'Pit Bull Terrier',
        name: '',
        status: 'Pre-exempt',
        birthDate: null,
        tattoo: null,
        colour: null,
        sex: null
      }]
    })

    const options = {
      method: 'GET',
      url: '/cdo/view/owner-details/P-123',
      auth
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(200)
    const [ownerDetailsCard, dogDetailsCard] = document.querySelectorAll('.govuk-summary-card')

    const [
      nameKey,
      dobKey,,
      emailKey,
      telKey
    ] = ownerDetailsCard.querySelectorAll('.govuk-summary-list__key')
    const [
      nameValue,
      dobValue,,
      emailValue,
      telValue
    ] = ownerDetailsCard.querySelectorAll('.govuk-summary-list__value')

    const notEntered = 'Not entered'
    expect(nameKey.textContent.trim()).toBe('Name')
    expect(dobKey.textContent.trim()).toBe('Date of birth')
    expect(emailKey.textContent.trim()).toBe('Email')
    expect(telKey.textContent.trim()).toBe('Telephone number 1')
    expect(nameValue.textContent.trim()).toBe('Wreck it Ralph')
    expect(dobValue.textContent.trim()).toBe(notEntered)
    expect(emailValue.textContent.trim()).toBe(notEntered)
    expect(telValue.textContent.trim()).toBe(notEntered)

    const [dogName, microchipNumber] = dogDetailsCard.querySelectorAll('td')
    expect(dogName.textContent.trim()).toBe(notEntered)
    expect(microchipNumber.textContent.trim()).toBe(notEntered)
  })

  test('GET /cdo/view/owner-details route returns 404 if no data found', async () => {
    getPersonAndDogs.mockResolvedValue(undefined)

    const options = {
      method: 'GET',
      url: '/cdo/view/owner-details/P-123',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(404)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
