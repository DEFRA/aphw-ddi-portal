const { auth, user, standardAuth } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Attachments template-test route', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/session/session-wrapper')
  const { getFromSession } = require('../../../../../../app/session/session-wrapper')

  jest.mock('../../../../../../app/lib/template-helper')
  const { testTemplateFile } = require('../../../../../../app/lib/template-helper')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    getFromSession.mockReturnValue()
    testTemplateFile.mockResolvedValue()

    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
    jest.clearAllMocks()
  })

  describe('GET /admin/attachments/test', () => {
    test('returns a 200', async () => {
      const options = {
        method: 'GET',
        url: '/admin/attachments/test',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('Test attachment file')
      expect(document.querySelector('#ddi_index_number').value).toContain('ED123456')
    })

    test('returns 403 given user is standard user', async () => {
      const options = {
        method: 'GET',
        url: '/admin/attachments/test',
        auth: standardAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(403)
    })
  })

  describe('POST /admin/attachments/test', () => {
    test('returns payload', async () => {
      const options = {
        method: 'POST',
        url: '/admin/attachments/test',
        auth,
        payload: { filename: 'filename1.pdf' }
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(204)
    })
  })
})