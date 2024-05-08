const { auth, user } = require('../../../../mocks/auth')
const FormData = require('form-data')
const { setInSession } = require('../../../../../app/session/session-wrapper')
jest.mock('../../../../../app/session/session-wrapper')
const { doSearch } = require('../../../../../app/api/ddi-index-api/search')
const { JSDOM } = require('jsdom')
jest.mock('../../../../../app/api/ddi-index-api/search'
)
describe('SearchBasic test', () => {
  jest.mock('../../../../../app/auth')
  const mockAuth = require('../../../../../app/auth')

  const createServer = require('../../../../../app/server')
  let server

  setInSession.mockReturnValue()

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/search/basic route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/search/basic',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /cdo/search/basic route returns 302 if not auth', async () => {
    const fd = new FormData()

    const options = {
      method: 'GET',
      url: '/cdo/search/basic',
      headers: fd.getHeaders(),
      payload: fd.getBuffer()
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('GET /cdo/search/basic with valid data returns 200', async () => {
    doSearch.mockResolvedValue([])

    const options = {
      method: 'GET',
      url: '/cdo/search/basic?searchTerms=term1&searchType=dog',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /cdo/search/basic dog record search with valid data and empty Dog name and Microchip number returns 200', async () => {
    doSearch.mockResolvedValue([
      {
        address: {
          town: 'LONDON',
          postcode: 'W1K 7EB',
          address_line_1: '47 PARK STREET',
          address_line_2: null
        },
        dogName: '',
        dogIndex: 'ED300242',
        lastName: 'Ralph',
        dogStatus: 'Pre-exempt',
        firstName: 'Wreck it',
        personReference: 'P-4813-BF4F',
        dogId: 300242,
        personId: 183,
        distance: 8,
        rank: 0.0607927
      }
    ])

    const options = {
      method: 'GET',
      url: '/cdo/search/basic?searchTerms=ED300242&searchType=dog',
      auth
    }

    const response = await server.inject(options)
    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(200)
    const [dogNameResult, ownerNameResult, microchipNumberResult] = document.querySelectorAll('.defra-results')
    expect(dogNameResult.textContent.trim()).toBe('Not entered')
    expect(ownerNameResult.textContent.trim()).toBe('Wreck it Ralph')
    expect(microchipNumberResult.textContent.trim()).toBe('Not entered')
  })

  test('GET /cdo/search/basic owner record search with valid data and empty Dog name returns 200', async () => {
    doSearch.mockResolvedValue([
      {
        personId: 183,
        personReference: 'P-4813-BF4F',
        lastName: 'Ralph',
        firstName: 'Wreck it',
        rank: 0.0607927,
        distance: 9,
        address: '47 PARK STREET, LONDON, W1K 7EB',
        dogs: [
          {
            dogId: 300242,
            dogIndex: 'ED300242',
            dogName: '',
            dogStatus: 'Pre-exempt'
          }
        ]
      }
    ])

    const options = {
      method: 'GET',
      url: '/cdo/search/basic?searchTerms=ED300242&searchType=owner',
      auth
    }

    const response = await server.inject(options)
    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(200)
    const [, dogNameResult] = document.querySelectorAll('.govuk-table__body td')
    expect(dogNameResult.textContent.trim()).toBe('Not entered')
  })

  test('GET /cdo/create/select-address with invalid data returns error', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/search/basic?searchTerms=',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
  })

  test('GET /cdo/create/select-address with invalid data returns error - invalid chars', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/search/basic?searchTerms=**abc&&',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
