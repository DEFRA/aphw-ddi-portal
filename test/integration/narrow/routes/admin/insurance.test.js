const { auth, user, standardAuth } = require('../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const FormData = require('form-data')
const { ApiConflictError } = require('../../../../../app/errors/api-conflict-error')
const { ApiErrorFailure } = require('../../../../../app/errors/api-error-failure')

describe('Insurance', () => {
  jest.mock('../../../../../app/auth')
  const mockAuth = require('../../../../../app/auth')

  jest.mock('../../../../../app/api/ddi-index-api/insurance')
  const { getCompanies, addInsuranceCompany, removeInsuranceCompany, getCompaniesNewest } = require('../../../../../app/api/ddi-index-api/insurance')

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

  describe('GET /admin/insurance', () => {
    test('GET /admin/insurance route returns 200', async () => {
      getCompanies.mockResolvedValue([{
        id: 2,
        name: 'Mario World Pet Insurance'
      }])

      const options = {
        method: 'GET',
        url: '/admin/insurance',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)
      expect(getCompanies).toHaveBeenCalled()

      const { document } = new JSDOM(response.payload).window

      const pageContent = document.querySelector('#main-content').textContent
      expect(document.querySelector('h1').textContent).toBe('Add or remove dog insurers')
      expect(pageContent).toContain('To change a dog insurer name, remove the dog insurer first. Then add the changed dog insurer name.')
      expect(pageContent).toContain('Add a dog insurer')
      expect(pageContent).toContain('Dog insurers are removed instantly if you select ‘Remove’ in the list below.')
      expect(pageContent).toContain('Removed dog insurers will not be available for new applications. Existing records are unchanged.')
      expect(document.querySelectorAll('.govuk-breadcrumbs__link')[0].getAttribute('href')).toEqual('/')
      expect(document.querySelectorAll('.govuk-breadcrumbs__link')[1].getAttribute('href')).toEqual('/admin/index')
      expect(document.querySelector('table.govuk-table th').textContent).toEqual('Dog insurer')
      expect(document.querySelectorAll('table.govuk-table td.govuk-table__cell')[0].textContent).toEqual('Mario World Pet Insurance')
      expect(document.querySelectorAll('table.govuk-table td.govuk-table__cell button.govuk-button')[0].getAttribute('value')).toEqual('2')
      expect(document.querySelector('h2.govuk-fieldset__heading').textContent).toBe('Add a dog insurer')
      expect(document.querySelectorAll('#insurer #name')).not.toBeNull()
      expect(document.querySelector('.govuk-form-group .govuk-hint').textContent.trim()).toBe('Enter an insurer name using capital letters, forexample AXA Insurance, Dogs Trust.')
      expect(document.querySelector('#insurer button').textContent).toBe('Add dog insurer')
      expect(document.querySelector('form#insurer-remove')).not.toBeNull()
    })

    test('GET /admin/insurance route returns 200 given no insurance companies returned', async () => {
      getCompanies.mockResolvedValue([])

      const options = {
        method: 'GET',
        url: '/admin/insurance',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)
      expect(getCompanies).toHaveBeenCalled()

      const { document } = new JSDOM(response.payload).window
      expect(document.querySelector('h1').textContent).toBe('Add a dog insurer')
      expect(document.querySelector('table.govuk-table')).toBeNull()
      expect(document.querySelector('form#insurer-remove')).toBeNull()
    })
    test('GET /admin/insurance route returns 403 given user is standard user', async () => {
      const options = {
        method: 'GET',
        url: '/admin/insurance',
        auth: standardAuth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(403)
    })
  })

  describe('POST /admin/insurance', () => {
    test('POST /admin/insurance route returns 302 if not auth', async () => {
      const fd = new FormData()

      const options = {
        method: 'POST',
        url: '/admin/insurance',
        headers: fd.getHeaders(),
        payload: fd.getBuffer()
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
    })

    test('POST /admin/insurance route returns 200 given insurance company is submitted', async () => {
      getCompaniesNewest.mockResolvedValue([{
        id: 2,
        name: 'Mario World Pet Insurance'
      }])
      const payload = {
        name: 'Mario World Pet Insurance'
      }

      const options = {
        method: 'POST',
        url: '/admin/insurance',
        auth,
        payload
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)
      const { document } = new JSDOM(response.payload).window
      expect(addInsuranceCompany).toHaveBeenCalledWith({ name: 'Mario World Pet Insurance' }, user)
      expect(getCompanies).not.toHaveBeenCalled()
      expect(getCompaniesNewest).toHaveBeenCalled()
      expect(document.querySelector('#name').getAttribute('value')).toBe(null)
    })

    test('POST /admin/insurance route returns 403 given user is standard user', async () => {
      getCompanies.mockResolvedValue([{
        id: 2,
        name: 'Mario World Pet Insurance'
      }])
      const payload = {
        name: 'Mario World Pet Insurance'
      }

      const options = {
        method: 'POST',
        url: '/admin/insurance',
        auth: standardAuth,
        payload
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(403)
    })

    test('POST /admin/insurance with empty data returns error', async () => {
      const options = {
        method: 'POST',
        url: '/admin/insurance',
        auth,
        payload: {}
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('.govuk-error-summary__list')).not.toBeNull()
      expect(document.querySelectorAll('.govuk-error-summary__list a').length).toBe(1)
      expect(document.querySelectorAll('.govuk-error-summary__list a')[0].textContent.trim()).toBe('Enter a name')
    })

    test('POST /admin/insurance with internal server error at api returns 500', async () => {
      getCompanies.mockResolvedValue([{
        id: 2,
        name: 'Mario World Pet Insurance'
      }])
      addInsuranceCompany.mockRejectedValue(new Error('Internal server error'))
      const payload = {
        name: 'Mario World Pet Insurance'
      }

      const options = {
        method: 'POST',
        url: '/admin/insurance',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(500)
    })

    test('POST /admin/insurance with empty insurance company name returns error', async () => {
      const payload = {
        name: ''
      }

      const options = {
        method: 'POST',
        url: '/admin/insurance',
        auth,
        payload
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('.govuk-error-summary__list')).not.toBeNull()
      expect(document.querySelectorAll('.govuk-error-summary__list a').length).toBe(1)
      expect(document.querySelectorAll('.govuk-error-summary__list a')[0].textContent.trim()).toBe('Enter a name')
      expect(document.querySelector('#name')).not.toBeNull()
    })

    test('POST /admin/insurance with duplicate username returns error', async () => {
      addInsuranceCompany.mockRejectedValue(new ApiConflictError(new ApiErrorFailure('409 Conflict', {
        payload: { error: 'Conflict', message: 'Insurance company with name Lloyds of London already exists', statusCode: 409 },
        statusCode: 409,
        statusMessage: 'Conflict'
      })))
      getCompanies.mockResolvedValue([{
        id: 2,
        name: 'Lloyds of London'
      }])
      const payload = {
        name: 'Lloyds of London'
      }

      const options = {
        method: 'POST',
        url: '/admin/insurance',
        auth,
        payload
      }

      const response = await server.inject(options)
      const { document } = new JSDOM(response.payload).window

      expect(response.statusCode).toBe(400)
      expect(document.querySelector('.govuk-error-summary__list')).not.toBeNull()
      expect(document.querySelectorAll('.govuk-error-summary__list a').length).toBe(1)
      expect(document.querySelectorAll('.govuk-error-summary__list a')[0].textContent.trim()).toBe('The insurer name is already listed')

      expect(document.querySelector('#name').getAttribute('value')).toBe('Lloyds of London')
    })

    test('POST /admin/insurance route returns 200 given insurance company is removed', async () => {
      const payload = {
        remove: '2'
      }

      const options = {
        method: 'POST',
        url: '/admin/insurance',
        auth,
        payload
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)
      expect(removeInsuranceCompany).toHaveBeenCalledWith(2, user)
      expect(getCompanies).toHaveBeenCalled()
      expect(getCompaniesNewest).not.toHaveBeenCalled()
    })

    test('POST /admin/insurance route returns 500 given insurance company is removed', async () => {
      const payload = {
        remove: 'An insurance company not an id'
      }

      const options = {
        method: 'POST',
        url: '/admin/insurance',
        auth,
        payload
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(500)
      expect(removeInsuranceCompany).not.toHaveBeenCalled()
    })
  })
})
