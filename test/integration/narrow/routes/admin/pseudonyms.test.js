const { auth, user } = require('../../../../mocks/auth')
const mockAuth = require('../../../../../app/auth')
const { JSDOM } = require('jsdom')
const exp = require('constants')
const FormData = require('form-data')

describe('Pseudonyms', () => {
  jest.mock('../../../../../app/auth')
  const mockAuth = require('../../../../../app/auth')

  jest.mock('../../../../../app/api/ddi-events-api/users')
  const { getUsers, createUser, deleteUser } = require('../../../../../app/api/ddi-events-api/users')

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

  test('GET /admin/pseudonyms route returns 200', async () => {
    getUsers.mockResolvedValue([{
      username: 'internal-user',
      pseudonym: 'Hal',
      rowKey: '6917e9f6-a921-47b8-a0a0-d2851ce8b944'
    }])

    const options = {
      method: 'GET',
      url: '/admin/pseudonyms',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
    expect(getUsers).toHaveBeenCalledWith(user)

    const { document } = new JSDOM(response.payload).window

    const pageContent = document.querySelector('#main-content').textContent
    expect(document.querySelector('h1').textContent).toBe('Add or remove pseudonyms')
    expect(pageContent).toContain('To change a pseudonym, remove the pseudonym first. Then add the new pseudonym and the team member’s email address.')
    expect(pageContent).toContain('Add a team member pseudonym')
    expect(pageContent).toContain('Pseudonyms delete instantly if you select ‘Remove’ in the list below.')
    expect(pageContent).toContain('Team members without a pseudonym will be displayed on the Index as')
    expect(pageContent).toContain('‘Index user’.')
    expect(document.querySelector('.govuk-back-link').getAttribute('href')).toEqual('/admin/index')
    expect(document.querySelectorAll('table.govuk-table th')[0].textContent).toEqual('Email')
    expect(document.querySelectorAll('table.govuk-table th')[1].textContent).toEqual('Pseudonym')
    expect(document.querySelectorAll('table.govuk-table td.govuk-table__cell')[0].textContent).toEqual('internal-user')
    expect(document.querySelectorAll('table.govuk-table td.govuk-table__cell')[1].textContent).toEqual('Hal')
    expect(document.querySelector('h2.govuk-fieldset__heading').textContent).toBe('Add a team member pseudonym')
    expect(document.querySelector('#add-a-pseudonym h2').textContent).toBe('Add a team member pseudonym')
    expect(document.querySelectorAll('#add-a-pseudonym #email')).not.toBeNull()
    expect(document.querySelectorAll('#add-a-pseudonym #pseudonym')).not.toBeNull()
    expect(document.querySelectorAll('#add-a-pseudonym #pseudonym')).not.toBeNull()
    expect(document.querySelector('#add-a-pseudonym button').textContent).toBe('Add pseudonym')
  })

  test('GET /admin/pseudonyms route returns 200 given no users returned', async () => {
    getUsers.mockResolvedValue([])

    const options = {
      method: 'GET',
      url: '/admin/pseudonyms',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
    expect(getUsers).toHaveBeenCalledWith(user)

    const { document } = new JSDOM(response.payload).window
    expect(document.querySelector('h1').textContent).toBe('Add a team member pseudonym')
    expect(document.querySelector('table.govuk-table')).toBeNull()
    expect(document.querySelector('form#pseudonym-remove')).toBeNull()
  })

  test('POST /admin/pseudonym route returns 302 if not auth', async () => {
    const fd = new FormData()

    const options = {
      method: 'POST',
      url: '/admin/pseudonyms',
      headers: fd.getHeaders(),
      payload: fd.getBuffer()
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('POST /admin/pseudonyms route returns 200 given team member is submitted', async () => {
    const payload = {
      email: 'new.user@example.com',
      pseudonym: 'George'
    }

    const options = {
      method: 'POST',
      url: '/admin/pseudonyms',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(createUser).toBeCalledWith({ username: 'new.user@example.com', pseudonym: 'George' }, user)
    expect(getUsers).toBeCalledWith(user)
  })

  test('POST /admin/pseudonyms route returns 200 given team member is removed', async () => {
    const payload = {
      remove: 'old.user@example.com'
    }

    const options = {
      method: 'POST',
      url: '/admin/pseudonyms',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(deleteUser).toBeCalledWith('old.user@example.com', user)
    expect(getUsers).toBeCalledWith(user)
  })
})
