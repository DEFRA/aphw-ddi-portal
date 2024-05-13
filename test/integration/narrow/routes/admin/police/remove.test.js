const { auth, user, standardAuth } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const FormData = require('form-data')

describe('Remove Police Forces page', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/police-forces')
  const { getPoliceForces, removePoliceForce } = require('../../../../../../app/api/ddi-index-api/police-forces')

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

  getPoliceForces.mockResolvedValue([
    {
      id: 1,
      name: 'Isengard Constabulary'
    },
    {
      id: 2,
      name: 'South Gondor Constabulary'
    },
    {
      id: 3,
      name: 'The Shire Constabulary'
    }
  ])

  describe('What is the name page', () => {
    test('GET /admin/police/remove returns a 200', async () => {
      const options = {
        method: 'GET',
        url: '/admin/police/remove',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(getPoliceForces).toHaveBeenCalled()
      expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('Which police force do you want to remove?')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Remove police force')
    })

    test('GET /admin/police/remove route returns 403 given user is standard user', async () => {
      const options = {
        method: 'GET',
        url: '/admin/police/remove',
        auth: standardAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(403)
    })

    test('POST /admin/police/remove police force route returns 400 with empty payload', async () => {
      const options = {
        method: 'POST',
        url: '/admin/police/remove',
        auth,
        payload: {}
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('Which police force do you want to remove?')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Remove police force')
      expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('Police force is required')
    })

    test('POST /admin/police/remove route returns 302 if not auth', async () => {
      const fd = new FormData()

      const options = {
        method: 'POST',
        url: '/admin/police/remove',
        headers: fd.getHeaders(),
        payload: fd.getBuffer()
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
    })
    test('POST /admin/police/remove police force route returns 400 with police force id missing', async () => {
      const options = {
        method: 'POST',
        url: '/admin/police/remove',
        auth,
        payload: {
          police: ''
        }
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('Which police force do you want to remove?')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Remove police force')
      expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('Police force is required')
    })
  })

  describe('Are you sure page', () => {
    test('POST /admin/police/remove police force route returns 200 and confirmation page given police force has been submitted', async () => {
      const options = {
        method: 'POST',
        url: '/admin/police/remove',
        auth,
        payload: {
          pk: '1'
        }
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('Are you sure you want to remove ‘Isengard Constabulary’ from the Index?')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Continue')
    })

    test('POST /admin/police/remove police force route returns 400 and confirmation page given confirmation page is submitted without an option', async () => {
      const options = {
        method: 'POST',
        url: '/admin/police/remove',
        auth,
        payload: {
          police: 'Isengard Constabulary',
          confirmation: 'true',
          pk: '1'
        }
      }
      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('Are you sure you want to remove ‘Isengard Constabulary’ from the Index?')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Continue')
      expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('Select an option')
    })

    test('POST /admin/police/remove police force route returns 302 given confirm page is submitted with No', async () => {
      const options = {
        method: 'POST',
        url: '/admin/police/remove',
        auth,
        payload: {
          police: 'Isengard Constabulary',
          pk: '95',
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
    removePoliceForce.mockResolvedValue()

    test('POST /admin/police/remove police force route returns 200 and success page given police force has been removed', async () => {
      const options = {
        method: 'POST',
        url: '/admin/police/remove',
        auth,
        payload: {
          police: 'Isengard Constabulary',
          pk: '95',
          confirmation: 'true',
          confirm: 'Y'
        }
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(removePoliceForce).toHaveBeenCalledWith(95, user)
      expect(response.statusCode).toBe(200)
      expect(document.querySelector('h1.govuk-panel__title').textContent.trim()).toBe('You removed Isengard Constabulary')
      expect(document.querySelector('#main-content').textContent.trim()).toContain('Isengard Constabulary is removed from the Index.')
      expect(document.querySelector('#main-content').textContent.trim()).toContain('Existing records are unchanged.')

      const policeForceLink = document.querySelector('#main-content .govuk-link')
      expect(policeForceLink.textContent.trim()).toBe('Add or remove a police force')
      expect(policeForceLink.getAttribute('href')).toBe('/admin/police')

      const breadcrumbs = document.querySelectorAll('a.govuk-breadcrumbs__link')
      expect(breadcrumbs[0].textContent.trim()).toBe('Home')
      expect(breadcrumbs[0].getAttribute('href')).toBe('/')
      expect(breadcrumbs[1].textContent.trim()).toBe('Admin')
      expect(breadcrumbs[1].getAttribute('href')).toBe('/admin/index')
    })

    test('POST /admin/police/remove police force route returns 409 and the enter police force name page given duplicate exists', async () => {
      removePoliceForce.mockRejectedValue({
        isBoom: true,
        output: {
          statusCode: 404
        }
      })

      const options = {
        method: 'POST',
        url: '/admin/police/remove',
        auth,
        payload: {
          police: 'Isengard Constabulary',
          pk: '95',
          confirmation: 'true',
          confirm: 'Y'
        }
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(404)
      expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('Which police force do you want to remove?')
      expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('Isengard Constabulary does not exist in the index')
    })
  })
})
