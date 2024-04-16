const { auth, user, standardAuth } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const Boom = require('@hapi/boom')

describe('Delete Owner', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/person')
  const { getPersonByReference } = require('../../../../../../app/api/ddi-index-api/person')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  describe('GET /cdo/delete/owner', () => {
    getPersonByReference.mockResolvedValue({
      id: 12345,
      personReference: 'P-12345',
      firstName: 'John',
      lastName: 'Smith'
    })

    test('GET /cdo/delete/owner route returns 200 given standard', async () => {
      const options = {
        method: 'GET',
        url: '/cdo/delete/owner/P-12345',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('h1').textContent.trim()).toBe('Are you sure you want to delete the owner record for John Smith?')
    })

    test('GET /cdo/delete/owner route returns 403 given standard user', async () => {
      const options = {
        method: 'GET',
        url: '/cdo/delete/owner/P-12345',
        auth: standardAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(403)
    })

    test('GET /cdo/delete/owner route returns 404 if no data found', async () => {
      getPersonByReference.mockRejectedValue(new Boom.Boom('Not found', { statusCode: 404 }))

      const options = {
        method: 'GET',
        url: '/cdo/delete/owner/P-12345',
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
