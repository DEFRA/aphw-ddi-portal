const { auth, user } = require('../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Upload validation', () => {
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

  describe('GET /upload/import-validation route', () => {
    test('returns 200', async () => {
      const options = {
        method: 'GET',
        url: '/upload/import-validation',
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

      expect(document.querySelectorAll('.govuk-table__cell')[2].textContent).toBe('1')
      expect(document.querySelectorAll('.govuk-table__cell')[3].textContent).toBe('John Smith')
      expect(document.querySelectorAll('.govuk-table__cell')[4].textContent).toBe('TS1 1TS')
      expect(document.querySelectorAll('.govuk-table__cell')[5].textContent).toBe('Rex')
    })
  })

  describe('GET /upload/import-validation route', () => {
    test('returns 200 when no rows', async () => {
      const options = {
        method: 'GET',
        url: '/upload/import-validation',
        auth
      }

      getFromSession.mockReturnValue({
        errors: ['error1'],
        rows: null,
        log: ['log1']
      })

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)

      const { document } = new JSDOM(response.payload).window

      expect(document.querySelectorAll('.govuk-table__cell')[0].textContent).toBe('error1')

      expect(document.querySelectorAll('.govuk-table__cell')[1].textContent).toBe('log1')
    })
  })

  describe('POST /upload/import-validation route', () => {
    test('returns 302', async () => {
      const options = {
        method: 'POST',
        url: '/upload/import-validation',
        auth
      }

      getFromSession.mockReturnValue('filename1.xlsx')

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
    })

    test('with missing session returns 500', async () => {
      const options = {
        method: 'POST',
        url: '/upload/import-validation',
        auth
      }

      getFromSession.mockReturnValue()

      const response = await server.inject(options)

      expect(response.statusCode).toBe(500)
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
