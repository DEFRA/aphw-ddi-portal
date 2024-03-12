const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('OwnerResults test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/persons')
  const { getPersons } = require('../../../../../../app/api/ddi-index-api/persons')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/create/owner-results route returns 302 and redirects to ', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/create/owner-results',
      auth
    }

    getPersons.mockResolvedValue([])

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)

    const { document } = new JSDOM(response.payload).window

    expect(document.location.href).toBe('/cdo/create/postcode-lookup')
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
