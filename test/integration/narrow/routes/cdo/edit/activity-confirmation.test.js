const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Confirm activity', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/session/cdo/activity')
  const { getActivityDetails } = require('../../../../../../app/session/cdo/activity')

  jest.mock('../../../../../../app/api/ddi-index-api/activities')
  const { getActivityById } = require('../../../../../../app/api/ddi-index-api/activities')

  jest.mock('../../../../../../app/lib/back-helpers')
  const { getMainReturnPoint } = require('../../../../../../app/lib/back-helpers')

  const createServer = require('../../../../../../app/server')
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
  })

  test('GET /cdo/edit/activity-confirmation route returns 200', async () => {
    getActivityDetails.mockReturnValue({
      pk: 'ED12345',
      source: 'dog',
      activityType: 'sent',
      activity: 2,
      activityDate: new Date(),
      titleReference: 'Dog ED12345'
    })

    getActivityById.mockResolvedValue({
      name: 'act1'
    })

    getMainReturnPoint.mockReturnValue('/main-return-url')

    const options = {
      method: 'GET',
      url: '/cdo/edit/activity-confirmation',
      auth
    }

    const response = await server.inject(options)
    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(200)
    expect(document.querySelectorAll('.govuk-list .govuk-link')[0].textContent).toBe('Go to the dog record for Dog ED12345')
    expect(document.querySelectorAll('.govuk-list .govuk-link')[0].getAttribute('href')).toBe('/main-return-url')
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })
})
