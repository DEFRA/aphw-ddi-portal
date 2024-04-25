const { auth, user } = require('../../../../../mocks/auth')
const FormData = require('form-data')
jest.mock('../../../../../../app/session/session-wrapper')
const { setInSession } = require('../../../../../../app/session/session-wrapper')
const { JSDOM } = require('jsdom')
jest.mock('../../../../../../app/api/ddi-index-api/search')

describe('Manage Live Cdos test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/cdos')
  const { getLiveCdos, getLiveCdosWithinMonth } = require('../../../../../../app/api/ddi-index-api/cdos')

  const createServer = require('../../../../../../app/server')
  let server

  setInSession.mockReturnValue()

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/manage route returns 200', async () => {
    getLiveCdos.mockResolvedValue([
      {
        id: 20001,
        index: 'ED20001',
        status: 'Pre-exempt',
        owner: 'Scott Pilgrim',
        personReference: 'P-A133-7E4C',
        cdoExpiry: new Date('2024-04-19'),
        humanReadableCdoExpiry: '19 April 2024',
        joinedExemptionScheme: null,
        policeForce: 'Cheshire Constabulary'
      },
      {
        id: 20002,
        index: 'ED20002',
        status: 'Pre-exempt ',
        owner: 'Ramona Flowers ',
        personReference: 'P-A133-7E5C',
        cdoExpiry: new Date('2024-04-20'),
        humanReadableCdoExpiry: '20 April 2024',
        joinedExemptionScheme: null,
        policeForce: 'Kent Police '
      }
    ])

    const options = {
      method: 'GET',
      url: '/cdo/manage',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(getLiveCdos).toHaveBeenCalledWith({
      column: 'cdoExpiry',
      order: 'ASC'
    })
    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelector('h1.govuk-heading-l').textContent.trim()).toBe('Manage CDOs')
    expect(document.querySelector('.govuk-table')).not.toBeNull()
    expect(document.querySelectorAll('.govuk-table thead th')[0].textContent.trim()).toBe('CDO expiry')
    expect(document.querySelectorAll('.govuk-table thead th')[1].textContent.trim()).toBe('Index number')
    expect(document.querySelectorAll('.govuk-table thead th')[2].textContent.trim()).toBe('Owner')
    expect(document.querySelectorAll('.govuk-table thead th')[3].textContent.trim()).toBe('Police force')

    const cols = document.querySelectorAll('.govuk-table .govuk-table__row td')

    expect(cols[0].textContent.trim()).toBe('19 April 2024')
    expect(cols[1].textContent.trim()).toBe('ED20001')
    expect(cols[2].textContent.trim()).toBe('Scott Pilgrim')
    expect(cols[3].textContent.trim()).toBe('Cheshire Constabulary')
  })

  test('GET /cdo/manage/due route returns 200', async () => {
    getLiveCdosWithinMonth.mockResolvedValue([
      {
        id: 20001,
        index: 'ED20001',
        status: 'Pre-exempt',
        owner: 'Scott Pilgrim',
        personReference: 'P-A133-7E4C',
        cdoExpiry: new Date('2024-04-19'),
        humanReadableCdoExpiry: '19 April 2024',
        joinedExemptionScheme: null,
        policeForce: 'Cheshire Constabulary'
      },
      {
        id: 20002,
        index: 'ED20002',
        status: 'Pre-exempt ',
        owner: 'Ramona Flowers ',
        personReference: 'P-A133-7E5C',
        cdoExpiry: new Date('2024-04-20'),
        humanReadableCdoExpiry: '20 April 2024',
        joinedExemptionScheme: null,
        policeForce: 'Kent Police '
      }
    ])

    const options = {
      method: 'GET',
      url: '/cdo/manage/due',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(getLiveCdosWithinMonth).toHaveBeenCalledWith({
      column: 'cdoExpiry',
      order: 'ASC'
    })
    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelector('h1.govuk-heading-l').textContent.trim()).toBe('Manage CDOs')
    expect(document.querySelector('.govuk-table')).not.toBeNull()
    expect(document.querySelector('.govuk-breadcrumbs__link').textContent.trim()).toBe('Home')
    expect(document.querySelector('.govuk-breadcrumbs__link').getAttribute('href')).toBe('/')
    expect(document.querySelectorAll('.govuk-table thead th')[0].textContent.trim()).toBe('CDO expiry')
    expect(document.querySelectorAll('.govuk-table thead th')[1].textContent.trim()).toBe('Index number')
    expect(document.querySelectorAll('.govuk-table thead th')[2].textContent.trim()).toBe('Owner')
    expect(document.querySelectorAll('.govuk-table thead th')[3].textContent.trim()).toBe('Police force')

    const cols = document.querySelectorAll('.govuk-table .govuk-table__row td')

    expect(cols[0].textContent.trim()).toBe('19 April 2024')
    expect(cols[1].textContent.trim()).toBe('ED20001')
    expect(cols[1].querySelector('.govuk-link').getAttribute('href')).toContain('/cdo/view/dog-details/ED20001')
    expect(cols[2].textContent.trim()).toBe('Scott Pilgrim')
    expect(cols[3].textContent.trim()).toBe('Cheshire Constabulary')
  })

  test('GET /cdo/manage/invalid-tab route returns 404', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/manage/invalid-tab',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
  })

  test('GET /cdo/manage route returns 302 if not auth', async () => {
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
