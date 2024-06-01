const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const { manualActivityEventBuilder, auditedEventBuilder, createdEventBuilder } = require('../../../../../mocks/activity')

describe('Check activities', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/cdo')
  const { getCdo } = require('../../../../../../app/api/ddi-index-api/cdo')

  jest.mock('../../../../../../app/api/ddi-index-api/dog')
  const { getDogOwner } = require('../../../../../../app/api/ddi-index-api/dog')

  jest.mock('../../../../../../app/api/ddi-index-api/person')
  const { getPersonByReference } = require('../../../../../../app/api/ddi-index-api/person')

  jest.mock('../../../../../../app/api/ddi-events-api/event')
  const { getEvents } = require('../../../../../../app/api/ddi-events-api/event')

  jest.mock('../../../../../../app/lib/model-helpers')
  const { cleanUserDisplayName } = require('../../../../../../app/lib/model-helpers')

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

  const validDogEvent = {
    events: [
      {
        operation: 'changed dog owner',
        actioningUser: {
          username: 'import-user',
          displayname: 'Import user'
        },
        timestamp: '2024-02-13T11:12:41.937Z',
        type: 'uk.gov.defra.ddi.event.change.owner',
        rowKey: '0a750a1a-bab9-41fb-beea-8e4ea2d842c5|1707837161111',
        subject: 'DDI Changed Dog Owner',
        details: 'Dog ED100 moved to John Smith'
      },
      {
        operation: 'changed dog owner',
        actioningUser: {
          username: 'import-user',
          displayname: 'Import user'
        },
        timestamp: '2024-02-13T12:12:41.937Z',
        type: 'uk.gov.defra.ddi.event.change.owner',
        rowKey: '0a750a1a-bab9-41fb-beea-8e4ea2d842c5|1707837161222',
        subject: 'DDI Changed Dog Owner',
        details: 'Dog ED123 moved to Peter Snow'
      },
      manualActivityEventBuilder({
        timestamp: '2024-02-15T16:12:41.937Z'
      }),
      auditedEventBuilder({
        changes: {
          edited: [
            [
              'cdo_issued',
              '2024-01-15',
              '2024-01-16T00:00:00.000Z'
            ],
            [
              'cdo_expiry',
              '2024-02-10',
              '2024-02-13T00:00:00.000Z'
            ]
          ]
        },
        timestamp: '2024-02-14T12:23:22.301Z'
      }),
      auditedEventBuilder({
        actioningUser: {
          username: 'dev@test.com',
          displayname: 'Developer'
        },
        operation: 'updated person',
        changes: {
          added: [],
          removed: [],
          edited: [
            [
              'address/addressLine1',
              '93 SILVERDALE AVENUE',
              '91 SILVERDALE AVENUE'
            ],
            [
              'contacts/email',
              '',
              'me@here.com'
            ]
          ]
        },
        timestamp: '2024-02-14T08:23:22.301Z',
        subject: 'DDI Update person'
      }),
      auditedEventBuilder({
        actioningUser: {
          username: 'dev@test.com',
          displayname: 'Developer'
        },
        operation: 'updated dog',
        changes: {
          added: [],
          removed: [],
          edited: [
            [
              'colour',
              'Brown',
              'Brown and white'
            ]
          ]
        },
        timestamp: '2024-02-14T08:22:52.441Z',
        subject: 'DDI Update dog'
      }),
      createdEventBuilder(),
      manualActivityEventBuilder({
        activity: {
          activity: '4',
          activityType: 'received',
          pk: 'ED300000',
          source: 'dog',
          activityDate: '2024-02-14T00:00:00.000Z',
          activityLabel: 'Police correspondence'
        },
        timestamp: '2024-02-14T15:12:41.937Z',
        subject: 'DDI Activity Police correspondence'
      })
    ]
  }

  const validOwnerEvent = {
    events: [
      manualActivityEventBuilder({
        activity: {
          activity: '5',
          activityType: 'sent',
          pk: 'P-123',
          source: 'owner',
          activityDate: '2024-02-15T00:00:00.000Z',
          activityLabel: 'Change of address form'
        },
        timestamp: '2024-02-14T15:12:41.937Z',
        subject: 'DDI Activity Police correspondence'
      })
    ]
  }

  getDogOwner.mockResolvedValue({ personReference: 'P-456' })

  test('GET /cdo/view/activity/xxx/dog route returns a 200 and valid content', async () => {
    getEvents.mockResolvedValue(validDogEvent)
    getCdo.mockResolvedValue({
      dog: {
        id: 300000,
        indexNumber: 'ED123',
        name: 'Bruno',
        status: { status: 'TEST' },
        dog_breed: { breed: 'breed1' }
      },
      person: {
        firstName: 'John Smith',
        addresses: [{
          address: {
          }
        }],
        person_contacts: []
      },
      exemption: {
        exemptionOrder: 2015,
        insurance: [{
          company: 'Dogs Trust'
        }]
      }
    })
    cleanUserDisplayName.mockReturnValue('Mr Developer')

    const options = {
      method: 'GET',
      url: '/cdo/view/activity/ED123/dog',
      auth
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(getEvents).toBeCalledWith(['ED123', 'P-456'])
    expect(cleanUserDisplayName).toBeCalledWith('Developer')
    expect(response.statusCode).toBe(200)
    expect(document.querySelectorAll('.govuk-caption-l')[0].textContent.trim()).toBe('Dog ED123')
    expect(document.querySelectorAll('h1.govuk-heading-l')[0].textContent.trim()).toBe('Check activity')
    expect(document.querySelectorAll('h1.govuk-heading-l')[0].textContent.trim()).toBe('Check activity')
    expect(document.querySelectorAll('caption.govuk-visually-hidden')[0].textContent.trim()).toBe('All activity')
    expect(document.querySelectorAll('.govuk-table th')[0].textContent.trim()).toBe('Date')
    expect(document.querySelectorAll('.govuk-table th')[1].textContent.trim()).toBe('Activity')
    expect(document.querySelectorAll('.govuk-table th')[2].textContent.trim()).toBe('Team member')

    const rows = document.querySelectorAll('.govuk-table__body .govuk-table__row')
    expect(rows.length).toBe(9)
    expect(rows[0].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('15 February 2024')
    expect(rows[0].querySelectorAll('.govuk-table__cell')[1].textContent.trim()).toBe('Police correspondence received')
    expect(rows[0].querySelectorAll('.govuk-table__cell')[2].textContent.trim()).toBe('Mr Developer')
    expect(rows[1].querySelectorAll('.govuk-table__cell')[1].textContent.trim()).toBe('CDO issue date updated')
    expect(rows[2].querySelectorAll('.govuk-table__cell')[1].textContent.trim()).toBe('CDO expiry date updated')
    expect(rows[3].querySelectorAll('.govuk-table__cell')[1].textContent.trim()).toBe('Dog record created (Pre-exempt)')
    expect(rows[4].querySelectorAll('.govuk-table__cell')[1].textContent.trim()).toBe('Address line 1 updated from 93 SILVERDALE AVENUE')
    expect(rows[5].querySelectorAll('.govuk-table__cell')[1].textContent.trim()).toBe('Email address updated')
    expect(rows[6].querySelectorAll('.govuk-table__cell')[1].textContent.trim()).toBe('Dog colour updated')
    expect(rows[7].querySelectorAll('.govuk-table__cell')[1].textContent.trim()).toBe('Police correspondence received')
    expect(rows[8].querySelectorAll('.govuk-table__cell')[1].textContent.trim()).toBe('Dog ED123 moved to Peter Snow')
  })

  test('GET /cdo/view/activity/xxx/owner route returns a 200 and valid content', async () => {
    getEvents.mockResolvedValue(validOwnerEvent)
    getPersonByReference.mockResolvedValue({
      personReference: 'P-123',
      firstName: 'John',
      lastName: 'Smith',
      addresses: [{
        address: {
        }
      }],
      person_contacts: []
    })
    cleanUserDisplayName.mockReturnValue('Mr Developer')

    const options = {
      method: 'GET',
      url: '/cdo/view/activity/P-123/owner',
      auth
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(getEvents).toBeCalledWith(['P-123'])
    expect(cleanUserDisplayName).toBeCalledWith('Developer')
    expect(response.statusCode).toBe(200)
    expect(document.querySelectorAll('.govuk-caption-l')[0].textContent.trim()).toBe('John Smith')
    expect(document.querySelectorAll('h1.govuk-heading-l')[0].textContent.trim()).toBe('Check activity')
    expect(document.querySelectorAll('h1.govuk-heading-l')[0].textContent.trim()).toBe('Check activity')
    expect(document.querySelectorAll('caption.govuk-visually-hidden')[0].textContent.trim()).toBe('All activity')
    expect(document.querySelectorAll('.govuk-table th')[0].textContent.trim()).toBe('Date')
    expect(document.querySelectorAll('.govuk-table th')[1].textContent.trim()).toBe('Activity')
    expect(document.querySelectorAll('.govuk-table th')[2].textContent.trim()).toBe('Team member')

    const rows = document.querySelectorAll('.govuk-table__body .govuk-table__row')
    expect(rows.length).toBe(1)
    expect(rows[0].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('15 February 2024')
    expect(rows[0].querySelectorAll('.govuk-table__cell')[1].textContent.trim()).toBe('Change of address form sent')
    expect(rows[0].querySelectorAll('.govuk-table__cell')[2].textContent.trim()).toBe('Mr Developer')
  })

  test('GET /cdo/view/activity/xxx/dog route returns a 200 and message given no activities exist', async () => {
    getCdo.mockResolvedValue({
      dog: {
        id: 300000,
        indexNumber: 'ED300000',
        name: 'Bruno',
        status: { status: 'TEST' },
        dog_breed: { breed: 'breed1' }
      },
      person: {
        firstName: 'John',
        lastName: 'Smith',
        addresses: [{
          address: {
          }
        }],
        person_contacts: []
      },
      exemption: {
        exemptionOrder: 2015,
        insurance: [{
          company: 'Dogs Trust'
        }]
      }
    })
    getEvents.mockResolvedValue({ events: [] })

    const options = {
      method: 'GET',
      url: '/cdo/view/activity/ED123/dog',
      auth
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(document.querySelectorAll('.govuk-table').length).toBe(0)
    const activityBlock = document.querySelector('div[data-testid="activity-info"]')
    expect(activityBlock.textContent.trim()).toContain('Future activity on the record will display here.')
    expect(activityBlock.textContent.trim()).toContain('The activities will include when we send or receive documents such as:')
    expect(activityBlock.querySelectorAll('.govuk-list li')[0].textContent.trim()).toBe('change of address forms')
    expect(activityBlock.querySelectorAll('.govuk-list li')[1].textContent.trim()).toBe('police correspondence')
    expect(activityBlock.querySelectorAll('.govuk-list li')[2].textContent.trim()).toBe('witness statements')
    expect(activityBlock.querySelectorAll('.govuk-list li')[3].textContent.trim()).toBe('judicial review notices')
  })

  test('GET /cdo/view/activity/xxx/dog route returns 404 if no dog data found', async () => {
    getCdo.mockResolvedValue(undefined)

    const options = {
      method: 'GET',
      url: '/cdo/view/activity/ED123/dog',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(404)
  })

  test('GET /cdo/view/activity route returns 404 if source is not dog', async () => {
    getCdo.mockResolvedValue(undefined)

    const options = {
      method: 'GET',
      url: '/cdo/view/activity/ED123/not-a-dog',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(404)
  })

  test('GET /cdo/view/activity/xxx/owner route returns a 200 and message given no activities exist', async () => {
    getPersonByReference.mockResolvedValue({
      personReference: 'P-123',
      firstName: 'John',
      lastName: 'Smith',
      addresses: [{
        address: {
        }
      }],
      person_contacts: []
    })
    getEvents.mockResolvedValue({ events: [] })

    const options = {
      method: 'GET',
      url: '/cdo/view/activity/P-123/owner',
      auth
    }

    const response = await server.inject(options)

    const { document } = new JSDOM(response.payload).window

    expect(document.querySelectorAll('.govuk-table').length).toBe(0)
    const activityBlock = document.querySelector('div[data-testid="activity-info"]')
    expect(activityBlock.textContent.trim()).toContain('Future owner activity on the record will display here.')
    expect(activityBlock.textContent.trim()).toContain('The activities will include:')
    expect(activityBlock.querySelectorAll('.govuk-list li')[0].textContent.trim()).toBe('changes of address')
    expect(activityBlock.querySelectorAll('.govuk-list li')[1].textContent.trim()).toBe('changes of email address and telephone numbers')
    expect(activityBlock.querySelectorAll('.govuk-list li')[2].textContent.trim()).toBe('changes of owner')
  })
  test('GET /cdo/view/activity/xxx/owner route returns 404 if no owner data found', async () => {
    getPersonByReference.mockResolvedValue(undefined)

    const options = {
      method: 'GET',
      url: '/cdo/view/activity/P-123/owner',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(404)
  })
})
