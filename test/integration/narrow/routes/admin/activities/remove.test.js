const { auth, user, standardAuth } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Remove Activities page', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/activities')
  const { deleteActivity, getActivityById } = require('../../../../../../app/api/ddi-index-api/activities')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    getActivityById.mockResolvedValue({
      id: 1,
      label: 'Activity 1',
      activity_source: { name: 'dog' },
      activity_type: { name: 'sent' }
    })

    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
    jest.clearAllMocks()
  })

  describe('Are you sure page', () => {
    test('GET /admin/activities/remove returns a 200', async () => {
      const options = {
        method: 'GET',
        url: '/admin/activities/remove/1',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(getActivityById).toHaveBeenCalled()
      expect(document.querySelector('form span').textContent.trim()).toBe('Dog record: something we send')
      expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('Are you sure you want to remove ‘Activity 1’ from the activity list?')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Continue')
    })

    test('GET /admin/activities/remove returns a 200 with different params', async () => {
      const options = {
        method: 'GET',
        url: '/admin/activities/remove/1',
        auth
      }

      getActivityById.mockResolvedValue({
        id: 1,
        label: 'Activity 1',
        activity_source: { name: 'owner' },
        activity_type: { name: 'received' }
      })

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(getActivityById).toHaveBeenCalled()
      expect(document.querySelector('form span').textContent.trim()).toBe('Owner record: something we receive')
      expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('Are you sure you want to remove ‘Activity 1’ from the activity list?')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Continue')
    })

    test('GET /admin/activities/remove route returns 403 given user is standard user', async () => {
      const options = {
        method: 'GET',
        url: '/admin/activities/remove/1',
        auth: standardAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(403)
    })

    test('POST /admin/activities/remove route returns 400 and confirmation page given confirmation page is submitted without an option', async () => {
      const options = {
        method: 'POST',
        url: '/admin/activities/remove/1',
        auth,
        payload: {}
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(400)

      expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('Are you sure you want to remove ‘Activity 1’ from the activity list?')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Continue')
      expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('Select an option')
    })

    test('POST /admin/activities/remove route returns 302 given confirm page is submitted with No', async () => {
      const options = {
        method: 'POST',
        url: '/admin/activities/remove/1',
        auth,
        payload: {
          confirm: 'N'
        }
      }
      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/admin/activities')
    })
  })

  describe('Success Page', () => {
    deleteActivity.mockResolvedValue()

    test('POST /admin/activities/remove route returns 200 and success page given confirm is yes', async () => {
      const options = {
        method: 'POST',
        url: '/admin/activities/remove/1',
        auth,
        payload: {
          confirm: 'Y'
        }
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(deleteActivity).toHaveBeenCalledWith('1', user)
      expect(document.querySelector('h1.govuk-panel__title').textContent.trim()).toBe('You removed Activity 1')
      expect(document.querySelector('#main-content').textContent.trim()).toContain('Activity 1 is removed from the activity list.')
      expect(document.querySelector('#main-content').textContent.trim()).toContain('Existing records are unchanged.')

      const courtLink = document.querySelector('#main-content .govuk-link')
      expect(courtLink.textContent.trim()).toBe('Manage activity lists')
      expect(courtLink.getAttribute('href')).toBe('/admin/activities')

      const breadcrumbs = document.querySelectorAll('a.govuk-breadcrumbs__link')
      expect(breadcrumbs[0].textContent.trim()).toBe('Home')
      expect(breadcrumbs[0].getAttribute('href')).toBe('/')
      expect(breadcrumbs[1].textContent.trim()).toBe('Admin')
      expect(breadcrumbs[1].getAttribute('href')).toBe('/admin/index')
    })

    test('POST /admin/activities/remove route returns 404 and the enter court name page given duplicate exists', async () => {
      deleteActivity.mockRejectedValue({
        isBoom: true,
        output: {
          statusCode: 404
        }
      })

      const options = {
        method: 'POST',
        url: '/admin/activities/remove/1',
        auth,
        payload: {
          confirm: 'Y'
        }
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(404)
      expect(document.querySelector('h1').textContent.trim()).toBe('Are you sure you want to remove ‘Activity 1’ from the activity list?')
      expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('Activity 1 does not exist in the index')
    })
  })

  test('POST /admin/activities/remove route returns 500 when different error', async () => {
    deleteActivity.mockImplementation(() => { throw new Error('db error') })

    const options = {
      method: 'POST',
      url: '/admin/activities/remove/1',
      auth,
      payload: {
        confirm: 'Y'
      }
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(500)
  })
})
