const { auth, user } = require('../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const FormData = require('form-data')
const { ApiConflictError } = require('../../../../../app/errors/api-conflict-error')
const { ApiErrorFailure } = require('../../../../../app/errors/api-error-failure')

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
    expect(document.querySelector('h1').textContent.trim()).toBe('Add or remove pseudonyms')
    expect(pageContent).toContain('To change a pseudonym, remove the pseudonym first. Then add the new pseudonym and the team member’s email address.')
    expect(pageContent).toContain('Add a team member pseudonym')
    expect(pageContent).toContain('Pseudonyms delete instantly if you select ‘Remove’ in the list below.')
    expect(pageContent).toContain('Team members without a pseudonym will be displayed on the Index as')
    expect(pageContent).toContain('‘Index user’.')
    expect(document.querySelectorAll('.govuk-breadcrumbs__link')[0].getAttribute('href')).toEqual('/')
    expect(document.querySelectorAll('.govuk-breadcrumbs__link')[1].getAttribute('href')).toEqual('/admin/index')
    expect(document.querySelectorAll('table.govuk-table th')[0].textContent).toEqual('Email')
    expect(document.querySelectorAll('table.govuk-table th')[1].textContent).toEqual('Pseudonym')
    expect(document.querySelectorAll('table.govuk-table td.govuk-table__cell')[0].textContent).toEqual('internal-user')
    expect(document.querySelectorAll('table.govuk-table td.govuk-table__cell')[1].textContent).toEqual('Hal')
    expect(document.querySelector('fieldset .govuk-fieldset__legend--m').textContent.trim()).toBe('Add a team member pseudonym')
    expect(document.querySelector('#add-a-pseudonym .govuk-fieldset__legend--m').textContent.trim()).toBe('Add a team member pseudonym')
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
    expect(document.querySelector('h1').textContent.trim()).toBe('Add a team member pseudonym')
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
    getUsers.mockResolvedValue([{
      username: 'new.user@example.com',
      pseudonym: 'George',
      rowKey: '6917e9f6-a921-47b8-a0a0-d2851ce8b944'
    }])
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
    const { document } = new JSDOM(response.payload).window
    expect(createUser).toBeCalledWith({ username: 'new.user@example.com', pseudonym: 'George' }, user)
    expect(getUsers).toBeCalledWith(user)
    expect(document.querySelector('#email').getAttribute('value')).toBe(null)
    expect(document.querySelector('#pseudonym').getAttribute('pseudonym')).toBe(null)
  })

  test('POST /admin/pseudonyms with empty data returns error', async () => {
    const options = {
      method: 'POST',
      url: '/admin/pseudonyms',
      auth,
      payload: {}
    }

    const response = await server.inject(options)
    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(400)
    expect(document.querySelector('.govuk-error-summary__list')).not.toBeNull()
    expect(document.querySelectorAll('.govuk-error-summary__list a').length).toBe(2)
    expect(document.querySelectorAll('.govuk-error-summary__list a')[0].textContent.trim()).toBe('Enter an email address')
    expect(document.querySelectorAll('.govuk-error-summary__list a')[1].textContent.trim()).toBe('Enter a pseudonym')
  })

  test('POST /admin/pseudonyms with internal server error at api returns 500', async () => {
    getUsers.mockResolvedValue([{
      username: 'new.user@example.com',
      pseudonym: 'George',
      rowKey: '6917e9f6-a921-47b8-a0a0-d2851ce8b944'
    }])
    createUser.mockRejectedValue(new Error('Internal server error'))
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

    expect(response.statusCode).toBe(500)
  })

  test('POST /admin/pseudonyms with invalid email returns error', async () => {
    const payload = {
      email: 'not.a.valid.email',
      pseudonym: 'George'
    }

    const options = {
      method: 'POST',
      url: '/admin/pseudonyms',
      auth,
      payload
    }

    const response = await server.inject(options)
    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(400)
    expect(document.querySelector('.govuk-error-summary__list')).not.toBeNull()
    expect(document.querySelectorAll('.govuk-error-summary__list a').length).toBe(1)
    expect(document.querySelectorAll('.govuk-error-summary__list a')[0].textContent.trim()).toBe('Enter a valid email address')
  })

  test('POST /admin/pseudonyms with duplicate username returns error', async () => {
    createUser.mockRejectedValue(new ApiConflictError(new ApiErrorFailure('409 Conflict', {
      payload: { error: 'Resource already found with username abe.lincon@example.com.', message: 'Resource already found with username abe.lincon@example.com.', statusCode: 409 },
      statusCode: 409,
      statusMessage: 'Conflict'
    })))
    getUsers.mockResolvedValue([{
      email: 'abe.lincon@example.com',
      pseudonym: 'Abe',
      rowKey: '6917e9f6-a921-47b8-a0a0-d2851ce8b944'
    }])
    const payload = {
      email: 'abe.lincon@example.com',
      pseudonym: 'Abe2'
    }

    const options = {
      method: 'POST',
      url: '/admin/pseudonyms',
      auth,
      payload
    }

    const response = await server.inject(options)
    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(400)
    expect(document.querySelector('.govuk-error-summary__list')).not.toBeNull()
    expect(document.querySelectorAll('.govuk-error-summary__list a').length).toBe(1)
    expect(document.querySelectorAll('.govuk-error-summary__list a')[0].textContent.trim()).toBe('This email address is already associated with another pseudonym')

    expect(document.querySelector('#email').getAttribute('value')).toBe('abe.lincon@example.com')
    expect(document.querySelector('#pseudonym').getAttribute('value')).toBe('Abe2')
  })

  test('POST /admin/pseudonyms with duplicate pseudonym returns error', async () => {
    createUser.mockRejectedValue(new ApiConflictError(new ApiErrorFailure('409 Conflict', {
      payload: { error: 'Resource already found with pseudonym George.', message: 'Resource already found with pseudonym George.', statusCode: 409 },
      statusCode: 409,
      statusMessage: 'Conflict'
    })))
    getUsers.mockResolvedValue([{
      username: 'user3@example.com',
      pseudonym: 'George',
      rowKey: '6917e9f6-a921-47b8-a0a0-d2851ce8b944'
    }])
    const payload = {
      email: 'user@example.com',
      pseudonym: 'George'
    }

    const options = {
      method: 'POST',
      url: '/admin/pseudonyms',
      auth,
      payload
    }

    const response = await server.inject(options)
    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(400)
    expect(document.querySelector('.govuk-error-summary__list')).not.toBeNull()
    expect(document.querySelectorAll('.govuk-error-summary__list a').length).toBe(1)
    expect(document.querySelectorAll('.govuk-error-summary__list a')[0].textContent.trim()).toBe('Enter a different pseudonym')
  })

  test('POST /admin/pseudonyms with duplicate username and pseudonym returns error', async () => {
    createUser.mockRejectedValue(new ApiConflictError(new ApiErrorFailure('409 Conflict', {
      payload: { error: 'Resource already found with username abe.lincoln@example.com. Resource already found with pseudonym Abe.', message: 'Resource already found with username abe.lincoln@example.com. Resource already found with pseudonym Abe.', statusCode: 409 },
      statusCode: 409,
      statusMessage: 'Conflict'
    })))
    getUsers.mockResolvedValue([{
      email: 'abe.lincon@example.com',
      pseudonym: 'Abe',
      rowKey: '6917e9f6-a921-47b8-a0a0-d2851ce8b944'
    }])
    const payload = {
      email: 'abe.lincon@example.com',
      pseudonym: 'Abe'
    }

    const options = {
      method: 'POST',
      url: '/admin/pseudonyms',
      auth,
      payload
    }

    const response = await server.inject(options)
    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(400)
    expect(document.querySelector('.govuk-error-summary__list')).not.toBeNull()
    expect(document.querySelectorAll('.govuk-error-summary__list a').length).toBe(2)
    expect(document.querySelectorAll('.govuk-error-summary__list a')[0].textContent.trim()).toBe('This email address is already associated with another pseudonym')
    expect(document.querySelectorAll('.govuk-error-summary__list a')[1].textContent.trim()).toBe('Enter a different pseudonym')

    expect(document.querySelector('#email').getAttribute('value')).toBe('abe.lincon@example.com')
    expect(document.querySelector('#pseudonym').getAttribute('value')).toBe('Abe')
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
