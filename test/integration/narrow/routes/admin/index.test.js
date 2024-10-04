const { auth, user } = require('../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Admin index', () => {
  jest.mock('../../../../../app/auth')
  const mockAuth = require('../../../../../app/auth')

  const createServer = require('../../../../../app/server')
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

  test('GET /admin/index route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/admin/index',
      auth
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(200)
    expect(document.querySelectorAll('h1.govuk-heading-l')[0].textContent.trim()).toBe('Admin area')
    expect(document.querySelector('#main-content').textContent.trim()).toContain('Manage Index lists')
    expect(document.querySelector('#main-content').textContent.trim()).toContain('Courts')
    expect(document.querySelector('#main-content').textContent.trim()).toContain('Police forces')
    expect(document.querySelector('#main-content').textContent.trim()).toContain('Dog insurers')
    expect(document.querySelector('#main-content').textContent.trim()).toContain('Delete dog owner records without a dog')
    expect(document.querySelector('#main-content').textContent.trim()).toContain('Add or remove police officers')
  })
})
