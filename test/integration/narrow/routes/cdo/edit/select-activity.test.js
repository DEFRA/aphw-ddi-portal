const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Select activity', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/cdo')
  const { getCdo } = require('../../../../../../app/api/ddi-index-api/cdo')

  jest.mock('../../../../../../app/api/ddi-index-api/dog')
  const { getDogOwner } = require('../../../../../../app/api/ddi-index-api/dog')

  jest.mock('../../../../../../app/lib/back-helpers')
  const { addBackNavigation, getMainReturnPoint, addBackNavigationForErrorCondition } = require('../../../../../../app/lib/back-helpers')

  jest.mock('../../../../../../app/session/cdo/activity')
  const { getActivityDetails } = require('../../../../../../app/session/cdo/activity')

  jest.mock('../../../../../../app/api/ddi-index-api/activities')
  const { getActivities, getActivityById } = require('../../../../../../app/api/ddi-index-api/activities')

  jest.mock('../../../../../../app/api/ddi-index-api/person')
  const { getPersonByReference } = require('../../../../../../app/api/ddi-index-api/person')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    addBackNavigation.mockReturnValue({ backLink: '/back' })
    addBackNavigationForErrorCondition.mockReturnValue({ backLink: '/back' })
    getMainReturnPoint.mockReturnValue('/main-return-url')
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
    const { document } = new JSDOM(response.payload).window
    expect(document.querySelectorAll('.govuk-back-link')[0].href).toBe('/back')
  })

  test('GET /cdo/edit/select-activity route returns 200 but uses alternative back nav', async () => {
    addBackNavigation.mockReturnValue({ backLink: '/' })

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
    const { document } = new JSDOM(response.payload).window
    expect(document.querySelectorAll('.govuk-back-link')[0].href).toBe('/main-return-url')
  })

  test('GET /cdo/edit/select-activity route returns 200 using owner', async () => {
    getActivityDetails.mockReturnValue({
      pk: 'P-123',
      source: 'owner',
      activityType: 'sent'
    })

    getPersonByReference.mockResolvedValue({
      firstName: 'John',
      lastName: 'Smith'
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
      'activityDate-day': '20',
      titleReference: 'Dog ED12345'
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

  test('POST /cdo/edit/select-activity route replaces pk if target not source', async () => {
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

    getActivityById.mockReturnValue({
      targetPk: 'owner',
      source: 'dog',
      activityType: 'sent',
      activity_event: {
        target_primary_key: 'owner'
      }
    })

    getDogOwner.mockResolvedValue({ personReference: 'P-456' })

    const payload = {
      pk: 'ED12345',
      source: 'dog',
      activityType: 'sent',
      activity: '2',
      'activityDate-year': '2023',
      'activityDate-month': '12',
      'activityDate-day': '20',
      titleReference: 'Dog ED12345'
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

  test('POST /cdo/edit/select-activity route uses owner', async () => {
    getPersonByReference.mockResolvedValue({
      firstName: 'John',
      lastName: 'Smith'
    })

    getActivityDetails.mockReturnValue({
      pk: 'P-123',
      source: 'owner',
      activityType: 'sent'
    })

    getActivityById.mockReturnValue({
      targetPk: 'owner',
      source: 'owner',
      activityType: 'sent',
      activity_event: {
        target_primary_key: 'owner'
      }
    })

    getDogOwner.mockResolvedValue({ personReference: 'P-456' })

    const payload = {
      pk: 'P-123',
      source: 'owner',
      activityType: 'sent',
      activity: '2',
      'activityDate-year': '2023',
      'activityDate-month': '12',
      'activityDate-day': '20',
      titleReference: 'John Smith'
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
    const { document } = new JSDOM(response.payload).window
    expect(document.querySelectorAll('.govuk-back-link')[0].href).toBe('/back')
  })

  test('POST /cdo/edit/select-activity route returns 400 for invalid payload with alternative back', async () => {
    addBackNavigationForErrorCondition.mockReturnValue({ backLink: '/' })

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
    const { document } = new JSDOM(response.payload).window
    expect(document.querySelectorAll('.govuk-back-link')[0].href).toBe('/main-return-url')
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
