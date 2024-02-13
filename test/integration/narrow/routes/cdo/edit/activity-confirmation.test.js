const { auth, user } = require('../../../../../mocks/auth')

describe('Confirm activity', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/session/cdo/activity')
  const { getActivityDetails } = require('../../../../../../app/session/cdo/activity')

  jest.mock('../../../../../../app/api/ddi-index-api/activities')
  const { getActivityById } = require('../../../../../../app/api/ddi-index-api/activities')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)

    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/edit/activity-confirmation route returns 200', async () => {
    getActivityDetails.mockReturnValue({
      pk: 'ED12345',
      source: 'dog',
      activityType: 'sent',
      activity: 2,
      activityDate: new Date()
    })

    getActivityById.mockResolvedValue({
      name: 'act1'
    })

    const options = {
      method: 'GET',
      url: '/cdo/edit/activity-confirmation',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
