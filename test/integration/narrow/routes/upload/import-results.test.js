const { auth, user } = require('../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Upload results', () => {
  jest.mock('../../../../../app/auth')
  const mockAuth = require('../../../../../app/auth')

  jest.mock('../../../../../app/api/ddi-index-api/import')
  const { doImport } = require('../../../../../app/api/ddi-index-api/import')

  jest.mock('../../../../../app/session/session-wrapper')
  const { getFromSession } = require('../../../../../app/session/session-wrapper')

  const createServer = require('../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    doImport.mockResolvedValue({})
    server = await createServer()
    await server.initialize()
  })

  describe('GET /upload/import-results route', () => {
    test('returns 200', async () => {
      const options = {
        method: 'GET',
        url: '/upload/import-results',
        auth
      }

      getFromSession.mockReturnValue({
        log: ['log1', 'log2']
      })

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)

      const { document } = new JSDOM(response.payload).window

      expect(document.querySelectorAll('.govuk-table__cell')[0].textContent).toBe('log1')
      expect(document.querySelectorAll('.govuk-table__cell')[1].textContent).toBe('log2')
    })
  })

  describe('POST /upload/import-results route', () => {
    test('returns 302', async () => {
      const payload = {
        confirm: 'Y'
      }

      const options = {
        method: 'POST',
        url: '/upload/import-results',
        auth,
        payload
      }

      getFromSession.mockReturnValue('filename1.xlsx')

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
    })

    test('with missing session returns 500', async () => {
      const payload = {
        confirm: 'Y'
      }

      const options = {
        method: 'POST',
        url: '/upload/import-results',
        auth,
        payload
      }

      getFromSession.mockReturnValue()

      const response = await server.inject(options)

      expect(response.statusCode).toBe(500)
    })

    test('with unchecked confirm returns 400', async () => {
      const payload = {}

      const options = {
        method: 'POST',
        url: '/upload/import-results',
        auth,
        payload
      }

      getFromSession.mockReturnValue({ log: [] })

      const response = await server.inject(options)

      expect(response.statusCode).toBe(400)
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
