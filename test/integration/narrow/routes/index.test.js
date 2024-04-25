const { auth, user } = require('../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Index test', () => {
  jest.mock('../../../../app/auth')
  const mockAuth = require('../../../../app/auth')

  const createServer = require('../../../../app/server')
  let server

  jest.mock('../../../../app/session/cdo')
  const { clearCdo } = require('../../../../app/session/cdo')

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET / route returns 302 with no auth', async () => {
    const options = {
      method: 'GET',
      url: '/'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('GET / route returns 200 and clears previous details', async () => {
    const options = {
      method: 'GET',
      url: '/',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const { document } = new JSDOM(response.payload).window
    expect(document.querySelectorAll('.govuk-card--dashboard .govuk-link')[1].textContent).toBe('Process new CDO or Interim Exemption')
    expect(document.querySelectorAll('.govuk-card--dashboard')[2].textContent.trim()).toContain('Track applications')
    expect(document.querySelectorAll('.govuk-card--dashboard')[2].textContent.trim()).toContain('Manage CDOs and interim exemptions')
    expect(document.querySelectorAll('.govuk-card--dashboard')[2].querySelector('.govuk-link').getAttribute('href')).toBe('/cdo/manage')
    expect(clearCdo).toHaveBeenCalledTimes(1)
  })

  afterEach(async () => {
    await server.stop()
  })
})
