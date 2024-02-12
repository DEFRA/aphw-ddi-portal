const { auth, user } = require('../../../../../mocks/auth')

describe('Select activity', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/cdo')
  const { getCdo } = require('../../../../../../app/api/ddi-index-api/cdo')

  jest.mock('../../../../../../app/session/cdo/activity')
  const { getActivityDetails } = require('../../../../../../app/session/cdo/activity')

  jest.mock('../../../../../../app/api/ddi-index-api/activities')
  const { getActivities } = require('../../../../../../app/api/ddi-index-api/activities')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/edit/select-activity route returns 200', async () => {
    getActivityDetails.mockReturnValue({
      pk: 'ED12345',
      source: 'dog',
      activityType: 'sent'
    })

    getCdo.mockResolvedValue({
      dog: {
        status: 'Exempt',
        indexNumber: 'ED12345'
      }
    })

    getActivities.mockResolvedValue([
      { text: 'act1', value: 1 },
      { text: 'act2', value: 2 }
    ])

    const options = {
      method: 'GET',
      url: '/cdo/edit/select-activity',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
  })

  test('GET /cdo/edit/select-activity route returns 404 when dog not found', async () => {
    getActivityDetails.mockReturnValue({
      pk: 'ED12345',
      source: 'dog',
      activityType: 'sent'
    })

    getCdo.mockResolvedValue(null)

    getActivities.mockResolvedValue([
      { text: 'act1', value: 1 },
      { text: 'act2', value: 2 }
    ])

    const options = {
      method: 'GET',
      url: '/cdo/edit/select-activity',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(404)
  })

  test('POST /cdo/edit/select-activity route returns 302', async () => {
    getCdo.mockResolvedValue({
      dog: {
        status: 'Exempt',
        indexNumber: 'ED12345'
      }
    })

    getActivityDetails.mockReturnValue({
      pk: 'ED12345',
      source: 'dog',
      activityType: 'sent'
    })

    getActivities.mockResolvedValue([
      { text: 'act1', value: 1 },
      { text: 'act2', value: 2 }
    ])

    const payload = {
      pk: 'ED12345',
      source: 'dog',
      activityType: 'sent',
      activity: '2',
      'activityDate-year': '2023',
      'activityDate-month': '12',
      'activityDate-day': '20'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/select-activity',
      auth,
      payload
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(302)
  })

  test('POST /cdo/edit/select-activity route returns 400 for invalid payload', async () => {
    getCdo.mockResolvedValue({
      dog: {
        status: 'Exempt',
        indexNumber: 'ED12345'
      }
    })

    getActivityDetails.mockReturnValue({
      pk: 'ED12345',
      source: 'dog',
      activityType: 'sent'
    })

    getActivities.mockResolvedValue([
      { text: 'act1', value: 1 },
      { text: 'act2', value: 2 }
    ])

    const payload = {
      pk: 'ED12345',
      source: 'dog',
      activityType: 'sent',
      activity: '2'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/select-activity',
      auth,
      payload
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(400)
  })

  test('POST /cdo/edit/select-activity route returns 404 for invalid payload and entity not found', async () => {
    getCdo.mockResolvedValue(null)

    getActivityDetails.mockReturnValue({
      pk: 'ED12345',
      source: 'dog',
      activityType: 'sent'
    })

    getActivities.mockResolvedValue([
      { text: 'act1', value: 1 },
      { text: 'act2', value: 2 }
    ])

    const payload = {
      pk: 'ED12345',
      source: 'dog',
      activityType: 'sent',
      activity: '2'
    }

    const options = {
      method: 'POST',
      url: '/cdo/edit/select-activity',
      auth,
      payload
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(404)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
