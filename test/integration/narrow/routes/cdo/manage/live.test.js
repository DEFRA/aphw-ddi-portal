const { auth, user } = require('../../../../../mocks/auth')
const FormData = require('form-data')
jest.mock('../../../../../../app/session/session-wrapper')
const { setInSession } = require('../../../../../../app/session/session-wrapper')
const { JSDOM } = require('jsdom')
jest.mock('../../../../../../app/api/ddi-index-api/search')

describe('SearchBasic test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  const createServer = require('../../../../../../app/server')
  let server

  setInSession.mockReturnValue()

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/manage route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/manage',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelector('h1.govuk-heading-l').textContent.trim()).toBe('Manage CDOs')
  })

  test('GET /cdo/search/basic route returns 302 if not auth', async () => {
    const fd = new FormData()

    const options = {
      method: 'GET',
      url: '/cdo/manage',
      headers: fd.getHeaders(),
      payload: fd.getBuffer()
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
