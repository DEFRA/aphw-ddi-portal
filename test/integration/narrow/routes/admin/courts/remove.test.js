const { auth, user, standardAuth } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')
// const FormData = require('form-data')

describe('Courts page', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
    jest.clearAllMocks()
  })

  describe('/admin/courts/remove', () => {
    test('GET /admin/courts/remove returns a 200', async () => {
      const options = {
        method: 'GET',
        url: '/admin/courts/remove',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(response.statusCode).toBe(200)
      expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('Which court do you want to remove?')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Remove court')
    })

    test('GET /admin/courts route returns 403 given user is standard user', async () => {
      const options = {
        method: 'GET',
        url: '/admin/courts/remove',
        auth: standardAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(403)
    })
  })
})
