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
    expect(cards[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[1].textContent.trim().indexOf('1 Test Street')).toBeGreaterThan(-1)
    expect(cards[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[1].textContent.trim().indexOf('Testarea')).toBeGreaterThan(-1)
    expect(cards[0].querySelectorAll('.govuk-summary-list__row .govuk-summary-list__value')[1].textContent.trim().indexOf('Testington')).toBeGreaterThan(-1)
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
