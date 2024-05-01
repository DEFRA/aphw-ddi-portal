const { auth, user, standardAuth } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')
// const FormData = require('form-data')

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

  test('GET /admin/courts/add returns a 200', async () => {
    const options = {
      method: 'GET',
      url: '/admin/courts/add',
      auth
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(200)
    expect(document.querySelector('h1 .govuk-label--l').textContent.trim()).toBe('What is the name of the court you want to add?')
    expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toContain('Add court')
  })

  test('GET /admin/courts/add route returns 403 given user is standard user', async () => {
    const options = {
      method: 'GET',
      url: '/admin/courts/add',
      auth: standardAuth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(403)
  })

  // test('POST /admin/courts add court route returns 200', async () => {
  //   const options = {
  //     method: 'POST',
  //     url: '/admin/courts',
  //     auth,
  //     payload: {
  //       addOrRemove: 'add'
  //     }
  //   }
  //
  //   const response = await server.inject(options)
  //
  //   expect(response.statusCode).toBe(302)
  //   expect(response.headers.location).toBe('/admin/courts/add')
  // })
  //
  // test('POST /admin/courts/add route returns 302 if not auth', async () => {
  //   const fd = new FormData()
  //
  //   const options = {
  //     method: 'POST',
  //     url: '/admin/courts/add',
  //     headers: fd.getHeaders(),
  //     payload: fd.getBuffer()
  //   }
  //
  //   const response = await server.inject(options)
  //   expect(response.statusCode).toBe(302)
  // })
})
