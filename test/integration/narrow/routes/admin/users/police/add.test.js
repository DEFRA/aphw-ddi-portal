const { auth, user, standardAuth } = require('../../../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const { ApiConflictError } = require('../../../../../../../app/errors/api-conflict-error')
const FormData = require('form-data')
const { ApiErrorFailure } = require('../../../../../../../app/errors/api-error-failure')

describe('Add police officer page', () => {
  jest.mock('../../../../../../../app/auth')
  const mockAuth = require('../../../../../../../app/auth')

  jest.mock('../../../../../../../app/api/ddi-index-api/users')
  const { addUsers, getUsers } = require('../../../../../../../app/api/ddi-index-api/users')

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

  describe('What is the name page', () => {
    test('GET /admin/users/police/add returns a 200', async () => {
      const options = {
        method: 'GET',
        url: '/admin/users/police/add',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(200)
      expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('What is the police officer’s email address?')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Add police officer')
    })

    test('GET /admin/users/police/add route returns 403 given user is standard user', async () => {
      const options = {
        method: 'GET',
        url: '/admin/users/police/add',
        auth: standardAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(403)
    })

    test('POST /admin/users/police/add route returns 400 with empty payload', async () => {
      const options = {
        method: 'POST',
        url: '/admin/users/police/add',
        auth,
        payload: {}
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('What is the police officer’s email address?')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Add police officer')
      expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('Enter a police officer')
    })

    test('POST /admin/users/police/add route returns 409 with police conflict', async () => {
      getUsers.mockResolvedValue([
        {
          id: 1,
          username: 'nicholas.angel@sandford.police.uk'
        },
        {
          id: 2,
          username: 'danny.butterman@sandford.police.uk'
        }
      ])
      const options = {
        method: 'POST',
        url: '/admin/users/police/add',
        auth,
        payload: {
          policeUser: 'nicholas.angel@sandford.police.uk'
        }
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('What is the police officer’s email address?')
      expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Add police officer')
      expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('This police officer is already in the allow list')
    })

    test('POST /admin/users/police/add route returns 302 if not auth', async () => {
      const fd = new FormData()

      const options = {
        method: 'POST',
        url: '/admin/users/police/add',
        headers: fd.getHeaders(),
        payload: fd.getBuffer()
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
    })
  })

  // describe('Are you sure page', () => {
  //   test('POST /admin/users/police/add court route returns 200 and confirmation page given court has been submitted', async () => {
  //     const options = {
  //       method: 'POST',
  //       url: '/admin/users/police/add',
  //       auth,
  //       payload: {
  //         court: 'Metropolis City Court'
  //       }
  //     }
  //
  //     const response = await server.inject(options)
  //     const { document } = new JSDOM(response.payload).window
  //
  //     expect(response.statusCode).toBe(200)
  //     expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('Are you sure you want to add ‘Metropolis City Court’ to the Index?')
  //   })
  //
  //   test('POST /admin/users/police/add court route returns 400 and confirmation page given confirmation page is submitted without an option', async () => {
  //     const options = {
  //       method: 'POST',
  //       url: '/admin/users/police/add',
  //       auth,
  //       payload: {
  //         court: 'Metropolis City Court',
  //         confirmation: 'true'
  //       }
  //     }
  //     const response = await server.inject(options)
  //     const { document } = new JSDOM(response.payload).window
  //
  //     expect(response.statusCode).toBe(400)
  //     expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('Are you sure you want to add ‘Metropolis City Court’ to the Index?')
  //     expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Continue')
  //     expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('Select an option')
  //   })
  //
  //   test('POST /admin/users/police/add court route returns 302 given confirm page is submitted with No', async () => {
  //     const options = {
  //       method: 'POST',
  //       url: '/admin/users/police/add',
  //       auth,
  //       payload: {
  //         court: 'Metropolis City Court',
  //         confirmation: 'true',
  //         confirm: 'N'
  //       }
  //     }
  //     const response = await server.inject(options)
  //
  //     expect(response.statusCode).toBe(302)
  //     expect(response.headers.location).toBe('/admin/courts')
  //   })
  // })
  //
  // describe('Success Page', () => {
  //   addCourt.mockResolvedValue({
  //     id: 262,
  //     name: 'Metropolis City Court'
  //   })
  //
  //   test('POST /admin/users/police/add court route returns 200 and success page given court has been submitted', async () => {
  //     const options = {
  //       method: 'POST',
  //       url: '/admin/users/police/add',
  //       auth,
  //       payload: {
  //         court: 'Metropolis City Court',
  //         confirmation: 'true',
  //         confirm: 'Y'
  //       }
  //     }
  //
  //     const response = await server.inject(options)
  //     const { document } = new JSDOM(response.payload).window
  //
  //     expect(addCourt).toHaveBeenCalledWith({ name: 'Metropolis City Court' }, user)
  //     expect(response.statusCode).toBe(200)
  //     expect(document.querySelector('h1.govuk-panel__title').textContent.trim()).toBe('You added Metropolis City Court')
  //     expect(document.querySelector('#main-content').textContent.trim()).toContain('Metropolis City Court is available in the Index.')
  //
  //     const courtLink = document.querySelector('#main-content .govuk-link')
  //     expect(courtLink.textContent.trim()).toBe('Add or remove a court')
  //     expect(courtLink.getAttribute('href')).toBe('/admin/courts')
  //
  //     const breadcrumbs = document.querySelectorAll('a.govuk-breadcrumbs__link')
  //     expect(breadcrumbs[0].textContent.trim()).toBe('Home')
  //     expect(breadcrumbs[0].getAttribute('href')).toBe('/')
  //     expect(breadcrumbs[1].textContent.trim()).toBe('Admin')
  //     expect(breadcrumbs[1].getAttribute('href')).toBe('/admin/index')
  //   })
  //
  //   test('POST /admin/users/police/add court route returns 409 and the enter court name page given duplicate exists', async () => {
  //     addCourt.mockRejectedValue(new ApiConflictError('conflict'))
  //
  //     const options = {
  //       method: 'POST',
  //       url: '/admin/users/police/add',
  //       auth,
  //       payload: {
  //         court: 'Metropolis City Court',
  //         confirmation: 'true',
  //         confirm: 'Y'
  //       }
  //     }
  //
  //     const response = await server.inject(options)
  //     const { document } = new JSDOM(response.payload).window
  //
  //     expect(response.statusCode).toBe(409)
  //     expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('What is the name of the court you want to add?')
  //     expect(document.querySelector('.govuk-error-summary__list li').textContent.trim()).toContain('This court name is already listed')
  //   })
  //
  //   test('POST /admin/users/police/add court route returns 500 if there is a server error', async () => {
  //     addCourt.mockRejectedValue(new Error('server error'))
  //
  //     const options = {
  //       method: 'POST',
  //       url: '/admin/users/police/add',
  //       auth,
  //       payload: {
  //         court: 'Metropolis City Court',
  //         confirmation: 'true',
  //         confirm: 'Y'
  //       }
  //     }
  //
  //     const response = await server.inject(options)
  //
  //     expect(response.statusCode).toBe(500)
  //   })
  // })
})
