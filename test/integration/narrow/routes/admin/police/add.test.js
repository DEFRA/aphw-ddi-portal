const { auth, user, standardAuth } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const { ApiConflictError } = require('../../../../../../app/errors/api-conflict-error')
const FormData = require('form-data')

describe('Police force page', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/police-forces')
  const { addPoliceForce } = require('../../../../../../app/api/ddi-index-api/police-forces')

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

  describe('What is the name page', () => {
    test('GET /admin/police/add returns a 200', async () => {
      const options = {
        method: 'GET',
        url: '/admin/police/add',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('What is the name of the police force you want to add?')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Add police force')
    })

    test('GET /admin/police/add route returns 403 given user is standard user', async () => {
      const options = {
        method: 'GET',
        url: '/admin/police/add',
        auth: standardAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(403)
    })

    test('POST /admin/police/add route returns 302 if not auth', async () => {
      const fd = new FormData()

      const options = {
        method: 'POST',
        url: '/admin/police/add',
        headers: fd.getHeaders(),
        payload: fd.getBuffer()
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
    })

    test('POST /admin/police/add police force route returns 400 with empty payload', async () => {
      const options = {
        method: 'POST',
        url: '/admin/police/add',
        auth,
        payload: {}
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('What is the name of the police force you want to add?')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Add police force')
      expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('Police force is required')
    })

    test('POST /admin/police/add route returns 302 if not auth', async () => {
      const fd = new FormData()

      const options = {
        method: 'POST',
        url: '/admin/police/add',
        headers: fd.getHeaders(),
        payload: fd.getBuffer()
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
    })
  })

  describe('Are you sure page', () => {
    test('POST /admin/police/add police force route returns 200 and confirmation page given police force has been submitted', async () => {
      const options = {
        method: 'POST',
        url: '/admin/police/add',
        auth,
        payload: {
          police: 'Metropolis Police Department'
        }
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('Are you sure you want to add ‘Metropolis Police Department’ to the Index?')
    })

    test('POST /admin/police/add police force route returns 400 and confirmation page given confirmation page is submitted without an option', async () => {
      const options = {
        method: 'POST',
        url: '/admin/police/add',
        auth,
        payload: {
          police: 'Metropolis Police Department',
          confirmation: 'true'
        }
      }
      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('Are you sure you want to add ‘Metropolis Police Department’ to the Index?')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Continue')
      expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('Select an option')
    })

    test('POST /admin/police/add police force route returns 302 given confirm page is submitted with No', async () => {
      const options = {
        method: 'POST',
        url: '/admin/police/add',
        auth,
        payload: {
          police: 'Metropolis Police Department',
          confirmation: 'true',
          confirm: 'N'
        }
      }
      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/admin/police')
    })
  })

  describe('Success Page', () => {
    addPoliceForce.mockResolvedValue({
      id: 262,
      name: 'Metropolis Police Department'
    })

    test('POST /admin/police/add police force route returns 200 and success page given police force has been submitted', async () => {
      const options = {
        method: 'POST',
        url: '/admin/police/add',
        auth,
        payload: {
          police: 'Metropolis Police Department',
          confirmation: 'true',
          confirm: 'Y'
        }
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(addPoliceForce).toHaveBeenCalledWith({ name: 'Metropolis Police Department' }, user)
      expect(response.statusCode).toBe(200)
      expect(document.querySelector('h1.govuk-panel__title').textContent.trim()).toBe('You added Metropolis Police Department')
      expect(document.querySelector('#main-content').textContent.trim()).toContain('Metropolis Police Department is available in the Index.')

      const policeForceLink = document.querySelector('#main-content .govuk-link')
      expect(policeForceLink.textContent.trim()).toBe('Add or remove a police force')
      expect(policeForceLink.getAttribute('href')).toBe('/admin/police')

      const breadcrumbs = document.querySelectorAll('a.govuk-breadcrumbs__link')
      expect(breadcrumbs[0].textContent.trim()).toBe('Home')
      expect(breadcrumbs[0].getAttribute('href')).toBe('/')
      expect(breadcrumbs[1].textContent.trim()).toBe('Admin')
      expect(breadcrumbs[1].getAttribute('href')).toBe('/admin/index')
    })

    test('POST /admin/police/add police force route returns 409 and the enter police force page given duplicate exists', async () => {
      addPoliceForce.mockRejectedValue(new ApiConflictError('conflict'))

      const options = {
        method: 'POST',
        url: '/admin/police/add',
        auth,
        payload: {
          police: 'Metropolis Police Department',
          confirmation: 'true',
          confirm: 'Y'
        }
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(409)
      expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('What is the name of the police force you want to add?')
      expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('This police force is already in the Index')
    })

    test('POST /admin/police/add police force route returns 500 given server error', async () => {
      addPoliceForce.mockRejectedValue(new Error('server error'))

      const options = {
        method: 'POST',
        url: '/admin/police/add',
        auth,
        payload: {
          police: 'Metropolis Police Department',
          confirmation: 'true',
          confirm: 'Y'
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(500)
    })
  })
})
