const { auth, user } = require('../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Upload completed', () => {
  jest.mock('../../../../../app/auth')
  const mockAuth = require('../../../../../app/auth')

  jest.mock('../../../../../app/session/session-wrapper')
  const { getFromSession } = require('../../../../../app/session/session-wrapper')

  const createServer = require('../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  describe('GET /upload/import-completed route', () => {
    test('returns 200', async () => {
      const options = {
        method: 'GET',
        url: '/upload/import-completed',
        auth
      }

      getFromSession.mockReturnValue({
        errors: ['error1'],
        rows: [{
          owner: {
            firstName: 'John',
            lastName: 'Smith',
            address: {
              postcode: 'TS1 1TS'
            }
          },
          dogs: [
            { name: 'Rex' }
          ]
        }],
        log: ['log1']
      })

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)

      const { document } = new JSDOM(response.payload).window

      expect(document.querySelectorAll('.govuk-table__cell')[0].textContent).toBe('error1')
      expect(document.querySelectorAll('.govuk-table__cell')[1].textContent).toBe('log1')
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
