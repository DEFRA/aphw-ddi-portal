const { auth, user } = require('../../../../mocks/auth')

describe('External events', () => {
  jest.mock('../../../../../app/auth')
  const mockAuth = require('../../../../../app/auth')

  jest.mock('../../../../../app/api/ddi-events-api/external-event')
  const { getExternalEvents } = require('../../../../../app/api/ddi-events-api/external-event')

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

  const eventRows = [
    {
      id: 3,
      start_time: new Date(2024, 1, 3, 11),
      end_time: new Date(2024, 1, 3, 11, 45),
      result: 'Success3'
    },
    {
      id: 2,
      start_time: new Date(2024, 1, 2, 11),
      end_time: new Date(2024, 1, 2, 13, 30),
      result: 'Success2'
    },
    {
      id: 1,
      start_time: new Date(2024, 1, 1, 11),
      end_time: new Date(2024, 1, 1, 12, 5, 20),
      result: 'Success1'
    }
  ]

  test('GET /admin/external-events route without auth returns 302', async () => {
    getExternalEvents.mockResolvedValue(eventRows)

    const options = {
      method: 'GET',
      url: '/admin/external-events'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('GET /admin/external-events route returns 200', async () => {
    getExternalEvents.mockResolvedValue(eventRows)

    const options = {
      method: 'GET',
      url: '/admin/external-events?queryType=dog&invalidParam=123',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(getExternalEvents).toHaveBeenCalledWith('?queryType=dog')
  })

  test('GET /admin/external-events rshould build all params', async () => {
    getExternalEvents.mockResolvedValue(eventRows)

    const options = {
      method: 'GET',
      url: '/admin/external-events?queryType=dog&pks=123,456&fromDate=2024-10-05&toDate=2024-10-15',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(getExternalEvents).toHaveBeenCalledWith('?queryType=dog&pks=123,456&fromDate=2024-10-05&toDate=2024-10-15')
  })
})
