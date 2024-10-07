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

    test('POST /admin/users/police add police user route returns 200', async () => {
      const options = {
        method: 'POST',
        url: '/admin/users/police',
        auth,
        payload: {
          addOrRemove: 'add'
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/admin/users/police/add')
    })

    test('POST /admin/users/police remove police user route returns 200', async () => {
      const options = {
        method: 'POST',
        url: '/admin/users/police',
        auth,
        payload: {
          addOrRemove: 'remove'
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/admin/users/police/remove')
    })

    test('POST /admin/users/police without an option returns 400', async () => {
      const options = {
        method: 'POST',
        url: '/admin/users/police',
        auth,
        payload: {}
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window
      expect(document.querySelector('.govuk-fieldset__heading').textContent.trim()).toBe('Do you want to add or remove police officers?')
      expect(response.statusCode).toBe(400)
    })

    test('POST /admin/users/police route returns 302 if not auth', async () => {
      const fd = new FormData()

      const options = {
        method: 'POST',
        url: '/admin/users/police',
        headers: fd.getHeaders(),
        payload: fd.getBuffer()
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
    })
  })
})
