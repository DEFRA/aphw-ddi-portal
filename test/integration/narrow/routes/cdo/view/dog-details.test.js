const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('View dog details', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/cdo')
  const { getCdo } = require('../../../../../../app/api/ddi-index-api/cdo')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/view/dog-details route returns 200', async () => {
    getCdo.mockResolvedValue({
      dog: {
        id: 1,
        name: 'Bruno',
        status: { status: 'TEST' },
        dog_breed: { breed: 'breed1' }
      },
      person: {
        firstName: 'John Smith',
        addresses: [{
          address: {
          }
        }],
        person_contacts: []
      },
      exemption: {
        exemptionOrder: 2015,
        insurance: [{
          company: 'Dogs Trust'
        }]
      }
    })

    const options = {
      method: 'GET',
      url: '/cdo/view/dog-details/ED123',
      auth
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(200)
    expect(document.querySelectorAll('.govuk-summary-list__value')[0].textContent.trim()).toBe('Bruno')
    expect(document.querySelectorAll('.govuk-summary-list__value')[1].textContent.trim()).toBe('John Smith')
    expect(document.querySelectorAll('.govuk-summary-list__value')[4].textContent.trim()).toBe('Dogs Trust')
  })

  test('GET /cdo/view/dog-details route returns 404 if no data found', async () => {
    getCdo.mockResolvedValue(undefined)

    const options = {
      method: 'GET',
      url: '/cdo/view/dog-details/ED123',
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
