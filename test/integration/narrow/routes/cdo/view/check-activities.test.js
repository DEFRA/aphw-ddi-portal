const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const { getCdo } = require('../../../../../../app/api/ddi-index-api/cdo')

describe('Check actitivities', () => {
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

  test('GET /cdo/view/activity route returns a 200', async () => {
    getCdo.mockResolvedValue({
      dog: {
        id: 300000,
        indexNumber: 'ED300000',
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
      url: '/cdo/view/activity/ED123/dog',
      auth
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(200)
    expect(document.querySelectorAll('.govuk-caption-l')[0].textContent.trim()).toBe('Dog ED300000')
    expect(document.querySelectorAll('h1.govuk-heading-l')[0].textContent.trim()).toBe('Check activity')
  })

  test('GET /cdo/view/activity route returns 404 if no dog data found', async () => {
    getCdo.mockResolvedValue(undefined)

    const options = {
      method: 'GET',
      url: '/cdo/view/activity/ED123/dog',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(404)
  })

  test('GET /cdo/view/activity route returns 404 if source is not dog', async () => {
    getCdo.mockResolvedValue(undefined)

    const options = {
      method: 'GET',
      url: '/cdo/view/activity/ED123/not-a-dog',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(404)
  })

})
