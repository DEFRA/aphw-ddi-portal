const { auth, user, standardAuth } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const FormData = require('form-data')

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

  describe('/admin/courts', () => {
    test('GET /admin/courts route returns 200', async () => {
      const options = {
        method: 'GET',
        url: '/admin/courts',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('.govuk-fieldset__heading').textContent.trim()).toBe('Do you want to add or remove a court?')
      expect(document.querySelectorAll('.govuk-radios__label')[0].textContent.trim()).toContain('Add')
      expect(document.querySelectorAll('.govuk-radios__label')[1].textContent.trim()).toContain('Remove')
    })

    test('GET /admin/courts route returns 403 given user is standard user', async () => {
      const options = {
        method: 'GET',
        url: '/admin/courts',
        auth: standardAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(403)
    })

    test('POST /admin/courts add court route returns 200', async () => {
      const options = {
        method: 'POST',
        url: '/admin/courts',
        auth,
        payload: {
          addOrRemove: 'add'
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/admin/courts/add')
    })

    test('POST /admin/courts remove court route returns 200', async () => {
      const options = {
        method: 'POST',
        url: '/admin/courts',
        auth,
        payload: {
          addOrRemove: 'remove'
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/admin/courts/remove')
    })

    test('POST /admin/courts without an option returns 400', async () => {
      const options = {
        method: 'POST',
        url: '/admin/courts',
        auth,
        payload: {}
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window
      expect(document.querySelector('.govuk-fieldset__heading').textContent.trim()).toBe('Do you want to add or remove a court?')
      expect(response.statusCode).toBe(400)
    })
  })
})
