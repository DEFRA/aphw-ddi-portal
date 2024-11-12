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
    const mainContentTextContent = document.querySelector('#main-content').textContent.trim()

    expect(document.querySelectorAll('h1.govuk-heading-l')[0].textContent.trim()).toBe('Admin area')
    expect(mainContentTextContent).toContain('Manage Index lists')
    expect(mainContentTextContent).toContain('Courts')
    expect(mainContentTextContent).toContain('Police forces')
    expect(mainContentTextContent).toContain('Dog insurers')
    expect(mainContentTextContent).toContain('Delete dog owner records without a dog')
    expect(mainContentTextContent).toContain('Add or remove police officers')
    expect(mainContentTextContent).toContain('List police officer access')
  })
})
