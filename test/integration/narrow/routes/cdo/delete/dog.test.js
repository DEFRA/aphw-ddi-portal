const { auth, user, standardAuth } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const { getDogDetails } = require('../../../../../../app/api/ddi-index-api/dog')

describe('Delete Dog', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/cdo')
  const { getCdo } = require('../../../../../../app/api/ddi-index-api/cdo')

  jest.mock('../../../../../../app/api/ddi-index-api/dog')
  const { getDogDetails } = require('../../../../../../app/api/ddi-index-api/dog')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  describe('GET /cdo/delete/dog', () => {
    getDogDetails.mockResolvedValue({
      id: 24957,
      indexNumber: 'ED24957',
      name: 'Kyleigh'
    })

    getCdo.mockResolvedValue({
      dog: {
        id: 1,
        indexNumber: 'ED200010',
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

    test('GET /cdo/delete/dog route returns 200 given standard', async () => {
      const options = {
        method: 'GET',
        url: '/cdo/delete/dog/ED200010',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('h1').textContent.trim()).toBe('Are you sure you want to delete dog record ED200010?')
    })

    test('GET /cdo/delete/dog route returns 403 given standard user', async () => {
      const options = {
        method: 'GET',
        url: '/cdo/delete/dog/ED200010',
        auth: standardAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(403)
    })

    test('GET /cdo/delete/dog route returns 404 if no data found', async () => {
      getDogDetails.mockResolvedValue(undefined)

      const options = {
        method: 'GET',
        url: '/cdo/delete/dog/ED200010',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(404)
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
