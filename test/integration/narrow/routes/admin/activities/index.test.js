const { deepClone } = require('../../../../../../app/lib/model-helpers')
const { auth, user, standardAuth } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Activities admin', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/activities')
  const { getAllActivities } = require('../../../../../../app/api/ddi-index-api/activities')

  const createServer = require('../../../../../../app/server')
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

  const activityRows = {
    dogSent: [
      { id: 1, label: 'dog sent 1', activity_type: { name: 'sent' } },
      { id: 2, label: 'dog sent 2', activity_type: { name: 'sent' } },
      { id: 3, label: 'dog sent 3', activity_type: { name: 'sent' } }
    ],
    dogReceived: [
      { id: 4, label: 'dog received 1', activity_type: { name: 'received' } },
      { id: 5, label: 'dog received 2', activity_type: { name: 'received' } }
    ],
    ownerSent: [
      { id: 6, label: 'owner sent 1', activity_type: { name: 'sent' } },
      { id: 7, label: 'owner sent 2', activity_type: { name: 'sent' } },
      { id: 8, label: 'owner sent 3', activity_type: { name: 'sent' } }
    ],
    ownerReceived: [
      { id: 9, label: 'owner received 1', activity_type: { name: 'received' } },
      { id: 10, label: 'owner received 2', activity_type: { name: 'received' } }
    ]
  }

  describe('GET /admin/activities', () => {
    test('route returns 200', async () => {
      getAllActivities.mockResolvedValue(activityRows)

      const options = {
        method: 'GET',
        url: '/admin/activities',
        auth
      }

      const response = await server.inject(options)

      const { document } = new JSDOM(response.payload).window

      expect(getAllActivities).toHaveBeenCalledTimes(1)
      expect(response.statusCode).toBe(200)
      expect(document.querySelectorAll('h1.govuk-heading-l')[0].textContent.trim()).toBe('Manage activity lists')
      expect(document.querySelectorAll('.govuk-summary-card__title')[0].textContent.trim()).toBe('Send activities')
      expect(document.querySelectorAll('.govuk-summary-card__title')[1].textContent.trim()).toBe('Receive activities')
      expect(document.querySelectorAll('.govuk-summary-card__title')[2].textContent.trim()).toBe('Send activities')
      expect(document.querySelectorAll('.govuk-summary-card__title')[3].textContent.trim()).toBe('Receive activities')

      const rows = document.querySelectorAll('.govuk-summary-list__key')
      expect(rows.length).toBe(10)
      expect(rows[0].textContent.trim()).toBe('dog sent 1')
      expect(rows[1].textContent.trim()).toBe('dog sent 2')
      expect(rows[2].textContent.trim()).toBe('dog sent 3')
      expect(rows[3].textContent.trim()).toBe('dog received 1')
      expect(rows[4].textContent.trim()).toBe('dog received 2')
      expect(rows[5].textContent.trim()).toBe('owner sent 1')
      expect(rows[6].textContent.trim()).toBe('owner sent 2')
      expect(rows[7].textContent.trim()).toBe('owner sent 3')
      expect(rows[8].textContent.trim()).toBe('owner received 1')
      expect(rows[9].textContent.trim()).toBe('owner received 2')

      const hrefs = document.querySelectorAll('.govuk-summary-list__actions a')
      expect(hrefs.length).toBe(10)
      expect(hrefs[0].getAttribute('href')).toBe('/admin/activities/remove/1')
      expect(hrefs[1].getAttribute('href')).toBe('/admin/activities/remove/2')
      expect(hrefs[2].getAttribute('href')).toBe('/admin/activities/remove/3')
      expect(hrefs[3].getAttribute('href')).toBe('/admin/activities/remove/4')
      expect(hrefs[4].getAttribute('href')).toBe('/admin/activities/remove/5')
      expect(hrefs[5].getAttribute('href')).toBe('/admin/activities/remove/6')
      expect(hrefs[6].getAttribute('href')).toBe('/admin/activities/remove/7')
      expect(hrefs[7].getAttribute('href')).toBe('/admin/activities/remove/8')
      expect(hrefs[8].getAttribute('href')).toBe('/admin/activities/remove/9')
      expect(hrefs[9].getAttribute('href')).toBe('/admin/activities/remove/10')
    })
  })

  test('GET /admin/activities route returns 403 given user is standard user', async () => {
    const options = {
      method: 'GET',
      url: '/admin/activities',
      auth: standardAuth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(403)
  })

  test('route prevents removal of certain types', async () => {
    const actRows = deepClone(activityRows)
    actRows.dogSent[1].label = 'Application pack'
    actRows.dogSent[2].label = 'Form 2'
    actRows.dogReceived[0].label = 'Application pack'
    actRows.dogReceived[1].label = 'Form 2'
    actRows.ownerSent[0].label = 'Application pack'
    actRows.ownerReceived[0].label = 'Application pack'
    getAllActivities.mockResolvedValue(actRows)

    const options = {
      method: 'GET',
      url: '/admin/activities',
      auth
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(getAllActivities).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(200)
    expect(document.querySelectorAll('h1.govuk-heading-l')[0].textContent.trim()).toBe('Manage activity lists')
    expect(document.querySelectorAll('.govuk-summary-card__title')[0].textContent.trim()).toBe('Send activities')
    expect(document.querySelectorAll('.govuk-summary-card__title')[1].textContent.trim()).toBe('Receive activities')
    expect(document.querySelectorAll('.govuk-summary-card__title')[2].textContent.trim()).toBe('Send activities')
    expect(document.querySelectorAll('.govuk-summary-card__title')[3].textContent.trim()).toBe('Receive activities')

    const rows = document.querySelectorAll('.govuk-summary-list__key')
    expect(rows.length).toBe(10)
    expect(rows[0].textContent.trim()).toBe('dog sent 1')
    expect(rows[1].textContent.trim()).toBe('Application pack')
    expect(rows[2].textContent.trim()).toBe('Form 2')
    expect(rows[3].textContent.trim()).toBe('Application pack')
    expect(rows[4].textContent.trim()).toBe('Form 2')
    expect(rows[5].textContent.trim()).toBe('Application pack')
    expect(rows[6].textContent.trim()).toBe('owner sent 2')
    expect(rows[7].textContent.trim()).toBe('owner sent 3')
    expect(rows[8].textContent.trim()).toBe('Application pack')
    expect(rows[9].textContent.trim()).toBe('owner received 2')

    const hrefs = document.querySelectorAll('.govuk-summary-list__actions a')
    expect(hrefs.length).toBe(7)
    expect(hrefs[0].getAttribute('href')).toBe('/admin/activities/remove/1')
    expect(hrefs[1].getAttribute('href')).toBe('/admin/activities/remove/4')
    expect(hrefs[2].getAttribute('href')).toBe('/admin/activities/remove/5')
    expect(hrefs[3].getAttribute('href')).toBe('/admin/activities/remove/7')
    expect(hrefs[4].getAttribute('href')).toBe('/admin/activities/remove/8')
    expect(hrefs[5].getAttribute('href')).toBe('/admin/activities/remove/9')
    expect(hrefs[6].getAttribute('href')).toBe('/admin/activities/remove/10')
  })
})
