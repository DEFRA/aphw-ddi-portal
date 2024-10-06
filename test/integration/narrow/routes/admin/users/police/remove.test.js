const { auth, user, standardAuth } = require('../../../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const { getUsers, removeUser } = require('../../../../../../../app/api/ddi-index-api/users')

describe('Remove Police user page', () => {
  jest.mock('../../../../../../../app/auth')
  const mockAuth = require('../../../../../../../app/auth')

  jest.mock('../../../../../../../app/api/ddi-index-api/users')
  const { removeUser, getUsers } = require('../../../../../../../app/api/ddi-index-api/users')

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

  getUsers.mockResolvedValue([
    {
      id: 1,
      username: 'nicholas.angel@sandford.police.uk',
      police_force_id: 1
    },
    {
      id: 2,
      username: 'danny.butterman@sandford.police.uk',
      police_force_id: 1
    },
    {
      id: 3,
      username: 'joe.bloggs@example.com'
    }
  ])

  describe('Which police officer do you want to remove page', () => {
    test('GET /admin/users/police/remove returns a 200', async () => {
      const options = {
        method: 'GET',
        url: '/admin/users/police/remove',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(getUsers).toHaveBeenCalled()
      expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('Which police officer do you want to remove?')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Remove police officer')
    })

    test('GET /admin/users/police/remove route returns 403 given user is standard user', async () => {
      const options = {
        method: 'GET',
        url: '/admin/users/police/remove',
        auth: standardAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(403)
    })

    test('POST /admin/users/police/remove route returns 400 with empty payload', async () => {
      const options = {
        method: 'POST',
        url: '/admin/users/police/remove',
        auth,
        payload: {}
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('Which police officer do you want to remove?')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Remove police officer')
      expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('Enter a police officer')
    })

    test('POST /admin/users/police/remove route returns 400 with police user id missing', async () => {
      const options = {
        method: 'POST',
        url: '/admin/users/police/remove',
        auth,
        payload: {
          policeUser: ''
        }
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('Which police officer do you want to remove?')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Remove police officer')
      expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('Enter a police officer')
    })
  })

  describe('Are you sure page', () => {
    test('POST /admin/users/police/remove court route returns 200 and confirmation page given court has been submitted', async () => {
      getUsers.mockResolvedValue([
        {
          id: 1,
          username: 'nicholas.angel@sandford.police.uk',
          police_force_id: 1
        },
        {
          id: 2,
          username: 'danny.butterman@sandford.police.uk',
          police_force_id: 1
        },
        {
          id: 3,
          username: 'joe.bloggs@example.com'
        }
      ])

      const options = {
        method: 'POST',
        url: '/admin/users/police/remove',
        auth,
        payload: {
          pk: '1'
        }
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('Are you sure you want to remove nicholas.angel@sandford.police.uk from the Index?')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Continue')
    })

    test('POST /admin/users/police/remove route returns 400 and confirmation page given confirmation page is submitted without an option', async () => {
      const options = {
        method: 'POST',
        url: '/admin/users/police/remove',
        auth,
        payload: {
          policeUser: 'nicholas.angel@sandford.police.uk',
          confirmation: 'true',
          pk: '1'
        }
      }
      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('Are you sure you want to remove nicholas.angel@sandford.police.uk from the Index?')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Continue')
      expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('Select an option')
    })

    test('POST /admin/users/police/remove route returns 302 given confirm page is submitted with No', async () => {
      const options = {
        method: 'POST',
        url: '/admin/users/police/remove',
        auth,
        payload: {
          policeUser: 'nicholas.angel@sandford.police.uk',
          pk: '95',
          confirmation: 'true',
          confirm: 'N'
        }
      }
      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/admin/users/police')
    })
  })

  describe('Success Page', () => {
    removeUser.mockResolvedValue()

    test('POST /admin/users/police/remove route returns 200 and success page given court has been submitted', async () => {
      const options = {
        method: 'POST',
        url: '/admin/users/police/remove',
        auth,
        payload: {
          policeUser: 'nicholas.angel@sandford.police.uk',
          pk: '95',
          confirmation: 'true',
          confirm: 'Y'
        }
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(removeUser).toHaveBeenCalledWith('nicholas.angel@sandford.police.uk', user)
      expect(response.statusCode).toBe(200)
      expect(document.querySelector('h1.govuk-panel__title').textContent.trim()).toBe('You removed a police officer from the Index')
      expect(document.querySelector('#main-content').textContent.trim()).toContain('nicholas.angel@sandford.police.uk is removed from the Dangerous Dogs Index and no longer has access.')

      const courtLink = document.querySelector('#main-content .govuk-link')
      expect(courtLink.textContent.trim()).toBe('Add or remove another police officer')
      expect(courtLink.getAttribute('href')).toBe('/admin/users/police')

      const breadcrumbs = document.querySelectorAll('a.govuk-breadcrumbs__link')
      expect(breadcrumbs[0].textContent.trim()).toBe('Home')
      expect(breadcrumbs[0].getAttribute('href')).toBe('/')
      expect(breadcrumbs[1].textContent.trim()).toBe('Admin')
      expect(breadcrumbs[1].getAttribute('href')).toBe('/admin/index')
    })

    test('POST /admin/users/police/remove court route returns 409 and the enter court name page given duplicate exists', async () => {
      removeUser.mockRejectedValue({
        isBoom: true,
        output: {
          statusCode: 404
        }
      })

      const options = {
        method: 'POST',
        url: '/admin/users/police/remove',
        auth,
        payload: {
          policeUser: 'nicholas.angel@sandford.police.uk',
          pk: '95',
          confirmation: 'true',
          confirm: 'Y'
        }
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(404)
      expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('Which police officer do you want to remove?')
      expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('nicholas.angel@sandford.police.uk does not exist in the index')
    })

    test('POST /admin/users/police/remove court route returns 500 given server error exists', async () => {
      removeUser.mockRejectedValue(new Error('server error'))

      const options = {
        method: 'POST',
        url: '/admin/users/police/remove',
        auth,
        payload: {
          policeUser: 'nicholas.angel@sandford.police.uk',
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
