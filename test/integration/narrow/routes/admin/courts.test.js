const { auth, user } = require('../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Courts page', () => {
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

  test('GET /admin/courts route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/admin/courts',
      auth
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(200)
    expect(document.querySelector('.govuk-fieldset__heading').textContent.trim()).toBe('Do you want to add or remove a court?')
    // expect(document.querySelector('#main-content').textContent.trim()).toContain('Manage Index lists')
    // expect(document.querySelector('#main-content').textContent.trim()).toContain('Courts')
  })
})
