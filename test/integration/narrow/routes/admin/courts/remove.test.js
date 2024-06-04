const { auth, user, standardAuth } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Remove Courts page', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/courts')
  const { removeCourt, getCourts } = require('../../../../../../app/api/ddi-index-api/courts')

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

  getCourts.mockResolvedValue([
    {
      id: 1,
      name: 'Isengard City Court'
    },
    {
      id: 2,
      name: 'South Gondor County Court'
    },
    {
      id: 3,
      name: 'The Shire County Court'
    }
  ])

  describe('What is the name page', () => {
    test('GET /admin/courts/remove returns a 200', async () => {
      const options = {
        method: 'GET',
        url: '/admin/courts/remove',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(getCourts).toHaveBeenCalled()
      expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('Which court do you want to remove?')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Remove court')
    })

    test('GET /admin/courts/remove route returns 403 given user is standard user', async () => {
      const options = {
        method: 'GET',
        url: '/admin/courts/remove',
        auth: standardAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(403)
    })

    test('POST /admin/courts/remove court route returns 400 with empty payload', async () => {
      const options = {
        method: 'POST',
        url: '/admin/courts/remove',
        auth,
        payload: {}
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('Which court do you want to remove?')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Remove court')
      expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('Court name is required')
    })

    test('POST /admin/courts/remove court route returns 400 with court id missing', async () => {
      const options = {
        method: 'POST',
        url: '/admin/courts/remove',
        auth,
        payload: {
          court: ''
        }
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('Which court do you want to remove?')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Remove court')
      expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('Court name is required')
    })
  })

  describe('Are you sure page', () => {
    test('POST /admin/courts/remove court route returns 200 and confirmation page given court has been submitted', async () => {
      const options = {
        method: 'POST',
        url: '/admin/courts/remove',
        auth,
        payload: {
          pk: '1'
        }
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('Are you sure you want to remove ‘Isengard City Court’ from the Index?')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Continue')
    })

    test('POST /admin/courts/remove court route returns 400 and confirmation page given confirmation page is submitted without an option', async () => {
      const options = {
        method: 'POST',
        url: '/admin/courts/remove',
        auth,
        payload: {
          court: 'Isengard City Court',
          confirmation: 'true',
          pk: '1'
        }
      }
      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('Are you sure you want to remove ‘Isengard City Court’ from the Index?')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Continue')
      expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('Select an option')
    })

    test('POST /admin/courts/remove court route returns 302 given confirm page is submitted with No', async () => {
      const options = {
        method: 'POST',
        url: '/admin/courts/remove',
        auth,
        payload: {
          court: 'Isengard City Court',
          pk: '95',
          confirmation: 'true',
          confirm: 'N'
        }
      }
      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/admin/courts')
    })
  })

  describe('Success Page', () => {
    removeCourt.mockResolvedValue()

    test('POST /admin/courts/remove court route returns 200 and success page given court has been submitted', async () => {
      const options = {
        method: 'POST',
        url: '/admin/courts/remove',
        auth,
        payload: {
          court: 'Isengard City Court',
          pk: '95',
          confirmation: 'true',
          confirm: 'Y'
        }
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(removeCourt).toHaveBeenCalledWith(95, user)
      expect(response.statusCode).toBe(200)
      expect(document.querySelector('h1.govuk-panel__title').textContent.trim()).toBe('You removed Isengard City Court')
      expect(document.querySelector('#main-content').textContent.trim()).toContain('Isengard City Court is removed from the Index.')
      expect(document.querySelector('#main-content').textContent.trim()).toContain('Existing records are unchanged.')

      const courtLink = document.querySelector('#main-content .govuk-link')
      expect(courtLink.textContent.trim()).toBe('Add or remove a court')
      expect(courtLink.getAttribute('href')).toBe('/admin/courts')

      const breadcrumbs = document.querySelectorAll('a.govuk-breadcrumbs__link')
      expect(breadcrumbs[0].textContent.trim()).toBe('Home')
      expect(breadcrumbs[0].getAttribute('href')).toBe('/')
      expect(breadcrumbs[1].textContent.trim()).toBe('Admin')
      expect(breadcrumbs[1].getAttribute('href')).toBe('/admin/index')
    })

    test('POST /admin/courts/remove court route returns 409 and the enter court name page given duplicate exists', async () => {
      removeCourt.mockRejectedValue({
        isBoom: true,
        output: {
          statusCode: 404
        }
      })

      const options = {
        method: 'POST',
        url: '/admin/courts/remove',
        auth,
        payload: {
          court: 'Isengard City Court',
          pk: '95',
          confirmation: 'true',
          confirm: 'Y'
        }
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(404)
      expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('Which court do you want to remove?')
      expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('Isengard City Court does not exist in the index')
    })

    test('POST /admin/courts/remove court route returns 500 given server error exists', async () => {
      removeCourt.mockRejectedValue(new Error('server error'))

      const options = {
        method: 'POST',
        url: '/admin/courts/remove',
        auth,
        payload: {
          court: 'Isengard City Court',
          pk: '95',
          confirmation: 'true',
          confirm: 'Y'
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(500)
    })
  })
})
