const { auth, user } = require('../../../../../mocks/auth')

describe('Add activity', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/cdo')
  const { getCdo } = require('../../../../../../app/api/ddi-index-api/cdo')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/edit/add-activity route returns 200', async () => {
    getCdo.mockResolvedValue({
      dog: {
        status: 'Exempt',
        indexNumber: 'ED12345'
      }
    })

    const options = {
      method: 'GET',
      url: '/cdo/edit/add-activity/ED12345/dog',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
  })

  test('GET /cdo/edit/add-activity route returns 404 when dog not found', async () => {
    getCdo.mockResolvedValue(null)

    const options = {
      method: 'GET',
      url: '/cdo/edit/add-activity/ED12345/dog',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(404)
  })

  test('POST /cdo/edit/add-activity route returns 400 when invalid payload', async () => {
    getCdo.mockResolvedValue({
      dog: {
        status: 'Exempt',
        indexNumber: 'ED12345'
      }
    })

    const payload = {
      source: 'dog',
      activityType: 'sent'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/add-activity',
      auth,
      payload
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(400)
  })

  test('POST /cdo/edit/add-activity route returns 404 when dog not found', async () => {
    getCdo.mockResolvedValue(null)

    const payload = {
      pk: 'ED12345',
      source: 'dog'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/add-activity',
      auth,
      payload
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(404)
  })

  test('POST /cdo/edit/add-activity route returns 302', async () => {
    getCdo.mockResolvedValue({
      dog: {
        status: 'Exempt',
        indexNumber: 'ED12345'
      }
    })

    const payload = {
      pk: 'ED12345',
      source: 'dog',
      activityType: 'sent'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/add-activity',
      auth,
      payload
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(302)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
