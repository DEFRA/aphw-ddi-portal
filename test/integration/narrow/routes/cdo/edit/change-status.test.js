const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const { ApiConflictError } = require('../../../../../../app/errors/api-conflict-error')
const { ApiErrorFailure } = require('../../../../../../app/errors/api-error-failure')

describe('Change status', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/cdo')
  const { getCdo } = require('../../../../../../app/api/ddi-index-api/cdo')

  jest.mock('../../../../../../app/api/ddi-index-api/dog')
  const { updateStatus } = require('../../../../../../app/api/ddi-index-api/dog')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/edit/change-status route returns 200', async () => {
    getCdo.mockResolvedValue({
      dog: {
        status: 'Exempt',
        indexNumber: 'ED12345'
      }
    })

    const options = {
      method: 'GET',
      url: '/cdo/edit/change-status/ED12345',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
  })

  test('GET /cdo/edit/change-status route returns 404 when dog not found', async () => {
    getCdo.mockResolvedValue(null)

    const options = {
      method: 'GET',
      url: '/cdo/edit/change-status/ED12345',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(404)
  })

  test('POST /cdo/edit/change-status route returns 302', async () => {
    getCdo.mockResolvedValue({
      dog: {
        status: 'Exempt',
        indexNumber: 'ED12345'
      }
    })

    updateStatus.mockResolvedValue()

    const payload = {
      indexNumber: 'ED12345',
      newStatus: 'Inactive'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/change-status',
      auth,
      payload
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(302)
    expect(updateStatus).toHaveBeenCalledTimes(1)
  })

  test('POST /cdo/edit/change-status route returns 404 given validation failed and no cdo', async () => {
    getCdo.mockResolvedValue(null)

    updateStatus.mockResolvedValue()

    const payload = {
      indexNumber: 'ED12345'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/change-status',
      auth,
      payload
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(404)
  })

  test('POST /cdo/edit/dog-details route returns 400 when payload is invalid', async () => {
    getCdo.mockResolvedValue({
      dog: {
        status: 'Exempt',
        indexNumber: 'ED12345'
      }
    })
    updateStatus.mockResolvedValue()

    const options = {
      method: 'POST',
      url: '/cdo/edit/change-status',
      auth,
      payload: {}
    }

    const response = await server.inject(options)

    const { document } = (new JSDOM(response.payload)).window

    expect(response.statusCode).toBe(400)
    expect(updateStatus).not.toHaveBeenCalled()
    expect(document.querySelector('.govuk-error-summary')).not.toBeNull()
  })

  test('POST /cdo/edit/dog-details route returns 400 when update returns a 409 microchip Conflict', async () => {
    getCdo.mockResolvedValue({
      dog: {
        status: 'Exempt',
        indexNumber: 'ED12345',
        microchipNumber: ''
      }
    })
    updateStatus.mockRejectedValue(new ApiConflictError(new ApiErrorFailure('409 Conflict', {
      statusCode: 409,
      statusMessage: 'The microchip number already exists',
      payload: {
        statusCode: 409,
        error: 'Conflict',
        message: 'The microchip number already exists',
        microchipNumbers: [
          '875257109325923'
        ]
      }
    })))

    const payload = {
      indexNumber: 'ED12345',
      newStatus: 'Inactive'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/change-status',
      auth,
      payload
    }

    const response = await server.inject(options)

    const { document } = (new JSDOM(response.payload)).window

    expect(response.statusCode).toBe(400)
    expect(document.querySelector('.govuk-error-summary').textContent).toContain('The microchip number is in use on another record.')
  })

  test('POST /cdo/edit/dog-details route returns 500 when payload is invalid', async () => {
    getCdo.mockResolvedValue({
      dog: {
        status: 'Exempt',
        indexNumber: 'ED12345'
      }
    })
    updateStatus.mockRejectedValue(new Error('server error'))

    const payload = {
      indexNumber: 'ED12345',
      newStatus: 'Inactive'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/change-status',
      auth,
      payload
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(500)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
