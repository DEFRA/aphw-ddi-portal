const { auth, user, standardAuth } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const { ApiConflictError } = require('../../../../../../app/errors/api-conflict-error')
const FormData = require('form-data')

describe('Add activities page', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/activities')
  const { addActivity } = require('../../../../../../app/api/ddi-index-api/activities')

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

  describe('GET /admin/activities/add', () => {
    test('returns a 200', async () => {
      const options = {
        method: 'GET',
        url: '/admin/activities/add/sent/dog',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('main span').textContent.trim()).toBe('Dog record: something we send')
      expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('What activity do you want to add?')
      expect(document.querySelector('main .govuk-hint').textContent.trim()).toBe('For example, change of address form, death of a dog form.')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Add activity')
    })

    test('returns a 200 with different params', async () => {
      const options = {
        method: 'GET',
        url: '/admin/activities/add/received/owner',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('main span').textContent.trim()).toBe('Owner record: something we receive')
      expect(document.querySelector('main .govuk-hint').textContent.trim()).toContain('For example, application pack, police correspondence.')
      expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('What activity do you want to add?')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Add activity')
    })

    test('returns 403 given user is standard user', async () => {
      const options = {
        method: 'GET',
        url: '/admin/activities/add/sent/dog',
        auth: standardAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(403)
    })
  })

  describe('POST /admin/activities/add', () => {
    test('returns 400 with empty payload', async () => {
      const options = {
        method: 'POST',
        url: '/admin/activities/add/sent/dog',
        auth,
        payload: {}
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('What activity do you want to add?')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Add activity')
      expect(document.querySelector('main .govuk-hint').textContent.trim()).toBe('For example, change of address form, death of a dog form.')
      expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('Enter an activity name')
    })

    test('returns 302 if not auth', async () => {
      const fd = new FormData()

      const options = {
        method: 'POST',
        url: '/admin/activities/add/sent/dog',
        headers: fd.getHeaders(),
        payload: fd.getBuffer()
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
    })
  })

  describe('Are you sure page', () => {
    test('POST /admin/activities/add route returns 200 and confirmation page given activity has been submitted', async () => {
      const options = {
        method: 'POST',
        url: '/admin/activities/add/sent/dog',
        auth,
        payload: {
          activity: 'New activity 1'
        }
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('Are you sure you want to add ‘New activity 1’ to the activity list?')
    })

    test('POST /admin/activities/add route returns 400 and confirmation page given confirmation page is submitted without an option', async () => {
      const options = {
        method: 'POST',
        url: '/admin/activities/add/sent/dog',
        auth,
        payload: {
          activity: 'New activity 1',
          confirmation: 'true'
        }
      }
      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('Are you sure you want to add ‘New activity 1’ to the activity list?')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Continue')
      expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('Select an option')
    })

    test('POST /admin/activities/add route returns 302 given confirm page is submitted with No', async () => {
      const options = {
        method: 'POST',
        url: '/admin/activities/add/sent/dog',
        auth,
        payload: {
          activity: 'New activity 1',
          confirmation: 'true',
          confirm: 'N'
        }
      }
      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/admin/activities')
    })
  })

  describe('Success Page', () => {
    addActivity.mockResolvedValue({
      id: 262,
      label: 'New activity 1',
      activitySource: 'dog',
      activityType: 'sent'
    })

    test('POST /admin/activities/add route returns 200 and success page given activity has been submitted', async () => {
      const options = {
        method: 'POST',
        url: '/admin/activities/add/sent/dog',
        auth,
        payload: {
          activity: 'New activity 1',
          confirmation: 'true',
          confirm: 'Y'
        }
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(addActivity).toHaveBeenCalledWith({ label: 'New activity 1', activitySource: 'dog', activityType: 'sent' }, user)
      expect(response.statusCode).toBe(200)
      expect(document.querySelector('h1.govuk-panel__title').textContent.trim()).toBe('You added New activity 1')
      expect(document.querySelector('#main-content').textContent.trim()).toContain('New activity 1 is available in the dog record send activities.')

      const activityLink = document.querySelector('#main-content .govuk-link')
      expect(activityLink.textContent.trim()).toBe('Manage activity lists')
      expect(activityLink.getAttribute('href')).toBe('/admin/activities')

      const breadcrumbs = document.querySelectorAll('a.govuk-breadcrumbs__link')
      expect(breadcrumbs[0].textContent.trim()).toBe('Home')
      expect(breadcrumbs[0].getAttribute('href')).toBe('/')
      expect(breadcrumbs[1].textContent.trim()).toBe('Admin')
      expect(breadcrumbs[1].getAttribute('href')).toBe('/admin/index')
    })

    test('POST /admin/activities/add route returns 404 and the enter activity name page given duplicate exists', async () => {
      addActivity.mockRejectedValue(new ApiConflictError('conflict'))

      const options = {
        method: 'POST',
        url: '/admin/activities/add/sent/dog',
        auth,
        payload: {
          activity: 'New activity 1',
          confirmation: 'true',
          confirm: 'Y'
        }
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(409)
      expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('What is the name of the activity you want to add?')
      expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('This activity name is already listed')
    })
  })

  test('POST /admin/activities/add route throws 500 when other error', async () => {
    addActivity.mockImplementation(() => { throw new Error('db error') })

    const options = {
      method: 'POST',
      url: '/admin/activities/add/sent/dog',
      auth,
      payload: {
        activity: 'New activity 1',
        confirmation: 'true',
        confirm: 'Y'
      }
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(500)
  })
})
