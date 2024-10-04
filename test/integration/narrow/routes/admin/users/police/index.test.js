const { auth, user, standardAuth } = require('../../../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const FormData = require('form-data')

describe('Police users page', () => {
  jest.mock('../../../../../../../app/auth')
  const mockAuth = require('../../../../../../../app/auth')

  const createServer = require('../../../../../../../app/server')
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

  describe('/admin/users/police', () => {
    test('GET /admin/users/police route returns 200', async () => {
      const options = {
        method: 'GET',
        url: '/admin/users/police',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('.govuk-fieldset__heading').textContent.trim()).toBe('Do you want to add or remove police officers?')
      expect(document.querySelectorAll('.govuk-radios__label')[0].textContent.trim()).toContain('Add')
      expect(document.querySelectorAll('.govuk-radios__label')[1].textContent.trim()).toContain('Remove')
      expect(document.querySelector('.govuk-back-link').getAttribute('href')).toBe('/admin/index')
    })

    test('GET /admin/users/police route returns 403 given user is standard user', async () => {
      const options = {
        method: 'GET',
        url: '/admin/users/police',
        auth: standardAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(403)
    })
  })
})
