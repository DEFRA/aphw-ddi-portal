const { auth, user } = require('../../../../../mocks/auth')
const FormData = require('form-data')
const { routes } = require('../../../../../../app/constants/cdo/owner')
const { JSDOM } = require('jsdom')

describe('EnforcementDetails test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/courts')
  const { getCourts } = require('../../../../../../app/api/ddi-index-api/courts')

  jest.mock('../../../../../../app/api/ddi-index-api/police-forces')
  const { getPoliceForces } = require('../../../../../../app/api/ddi-index-api/police-forces')

  jest.mock('../../../../../../app/session/cdo/dog')
  const { getDogs } = require('../../../../../../app/session/cdo/dog')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    getCourts.mockResolvedValue([{ id: 1, name: 'Test court' }])
    getPoliceForces.mockResolvedValue([{ id: 1, name: 'Test force' }])
    getDogs.mockReturnValue([{
      applicationType: 'cdo'
    }])

    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/create/enforcement-details route returns 200 - back link standard & CDO', async () => {
    const options = {
      method: 'GET',
      url: '/cdo/create/enforcement-details',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)

    const { document } = new JSDOM(response.result).window
    expect(document.querySelector('.govuk-back-link').getAttribute('href')).toBe('/cdo/create/confirm-dog-details')
    expect(document.querySelector('label[for="court"]').textContent.trim()).toBe('Court')
  })

  test('GET /cdo/create/enforcement-details route returns 200 - back link to summary & Interim Exemption', async () => {
    getDogs.mockReturnValue([{
      applicationType: 'interim-exempt'
    }])
    const options = {
      method: 'GET',
      url: '/cdo/create/enforcement-details?fromSummary=true',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)

    const { document } = new JSDOM(response.result).window
    expect(document.querySelector('.govuk-back-link').getAttribute('href')).toBe('/cdo/create/full-summary')
    expect(document.querySelector('label[for="court"]').textContent.trim()).toBe('Court (optional)')
  })

  test('POST /cdo/create/enforcement-details route returns 302 if not auth', async () => {
    const fd = new FormData()
    fd.append('court', '1')

    const options = {
      method: 'POST',
      url: '/cdo/create/enforcement-details',
      headers: fd.getHeaders(),
      payload: fd.getBuffer()
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('POST /cdo/create/enforcement-details with invalid data returns error', async () => {
    const payload = {
      court: '1',
      legislationOfficer: 'John Smith',
      courtRequired: 'false'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/enforcement-details',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
  })

  test('POST /cdo/create/enforcement-details without court fails for cdo', async () => {
    const payload = {
      policeForce: '2',
      courtRequired: 'true'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/enforcement-details',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
  })

  test('POST /cdo/create/enforcement-details without court but with valid data for an interim exempt forwards to next screen', async () => {
    const nextScreenUrl = routes.fullSummary.get

    const payload = {
      policeForce: '2',
      courtRequired: 'false'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/enforcement-details',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(nextScreenUrl)
  })

  test('POST /cdo/create/enforcement-details with valid data forwards to next screen', async () => {
    const nextScreenUrl = routes.fullSummary.get

    const payload = {
      court: '1',
      policeForce: '2',
      courtRequired: 'false'
    }

    const options = {
      method: 'POST',
      url: '/cdo/create/enforcement-details',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(nextScreenUrl)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
