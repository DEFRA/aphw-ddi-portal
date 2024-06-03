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

  test('GET /cdo/edit/activity-confirmation route returns 200 given owner record', async () => {
    getActivityDetails.mockReturnValue({
      pk: 'ED12345',
      source: 'owner',
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

    expect(response.statusCode).toBe(200)
  })

  test('GET /cdo/edit/activity-confirmation route returns 200 given alternative return link', async () => {
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

    getMainReturnPoint.mockReturnValue('/')

    const options = {
      method: 'GET',
      url: '/cdo/edit/activity-confirmation',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
  })

  test('GET /cdo/edit/activity-confirmation route returns 200 given alternative return link which is not defined', async () => {
    getActivityDetails.mockReturnValue({
      pk: 'ED12345',
      source: 'owner',
      activityType: 'sent',
      activity: 2,
      activityDate: new Date(),
      titleReference: 'Dog ED12345'
    })

    getActivityById.mockResolvedValue({
      name: 'act1'
    })

    getMainReturnPoint.mockReturnValue('/')

    const options = {
      method: 'GET',
      url: '/cdo/edit/activity-confirmation',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
  })

  test('GET /cdo/edit/activity-confirmation route returns 404 given no activity exists', async () => {
    getActivityDetails.mockReturnValue({})

    const options = {
      method: 'GET',
      url: '/cdo/edit/activity-confirmation',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(404)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
