const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Check activities', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/cdo')
  const { getCdo } = require('../../../../../../app/api/ddi-index-api/cdo')

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

  const validEvent = {
    events: [
      {
        activity: {
          activity: '5',
          activityType: 'received',
          pk: 'ED300000',
          source: 'dog',
          activityDate: '2024-02-10T00:00:00.000Z',
          activityLabel: 'Police correspondence'
        },
        operation: 'activity',
        actioningUser: {
          username: 'Developer',
          displayname: 'Developer'
        },
        timestamp: '2024-02-15T15:12:41.937Z',
        type: 'uk.gov.defra.ddi.event.activity',
        rowKey: '0a750a1a-bab9-41fb-beea-8e4ea2d842c1|1707837161937',
        subject: 'DDI Activity Police correspondence'
      },
      {
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
        type: 'uk.gov.defra.ddi.event.update',
        rowKey: '82a0507b-f2e5-4ba7-8e41-14a7ef60b972|1707899002301',
        subject: 'DDI Update person'
      },
      {
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
        type: 'uk.gov.defra.ddi.event.update',
        rowKey: 'c48e420a-0eb6-457d-bffa-f53c788330fc|1707898972441',
        subject: 'DDI Update dog'
      },
      {
        actioningUser: {
          username: 'dev@test.com',
          displayname: 'Developer'
        },
        operation: 'created cdo',
        created: {
          owner: {
            id: 3,
            first_name: 'John',
            last_name: 'Jeffries',
            birth_date: null,
            person_reference: 'P-57DC-2761',
            address: {
              id: 5,
              address_line_1: 'FLAT 3, 3 THE LAUREATE, CHARLES STREET',
              address_line_2: null,
              town: 'BRISTOL',
              postcode: 'BS1 3DG',
              county: null,
              country_id: 1,
              country: {
                country: 'England'
              }
            }
          },
          dogs: [
            {
              id: 300002,
              dog_reference: 'a36ba664-9716-4b85-85cd-2b7cfe628cbb',
              index_number: 'ED300002',
              dog_breed_id: 2,
              status_id: 5,
              name: 'Jake',
              birth_date: null,
              death_date: null,
              tattoo: null,
              colour: null,
              sex: null,
              exported_date: null,
              stolen_date: null,
              untraceable_date: null,
              dog_breed: {
                breed: 'Pit Bull Terrier'
              },
              status: {
                id: 5,
                status: 'Pre-exempt',
                status_type: 'STANDARD'
              },
              registration: {
                id: 3,
                dog_id: 300002,
                status_id: 1,
                police_force_id: 1,
                court_id: 31,
                exemption_order_id: 1,
                created_on: '2024-02-14T08:24:22.440Z',
                cdo_issued: '2024-02-14',
                cdo_expiry: '2024-04-14',
                time_limit: null,
                certificate_issued: null,
                legislation_officer: '',
                application_fee_paid: null,
                neutering_confirmation: null,
                microchip_verification: null,
                joined_exemption_scheme: null,
                withdrawn: null,
                typed_by_dlo: null,
                microchip_deadline: null,
                neutering_deadline: null,
                removed_from_cdo_process: null,
                police_force: {
                  name: 'Avon and Somerset Constabulary'
                },
                court: {
                  name: 'Bristol Magistrates\' Court'
                }
              }
            }
          ]
        },
        timestamp: '2024-02-14T08:24:22.487Z',
        type: 'uk.gov.defra.ddi.event.create',
        rowKey: 'df2ffe61-9024-43f0-a05f-74022a73847e|1707899062487',
        subject: 'DDI Create cdo'
      },
      {
        activity: {
          activity: '4',
          activityType: 'received',
          pk: 'ED300000',
          source: 'dog',
          activityDate: '2024-02-14T00:00:00.000Z',
          activityLabel: 'Police correspondence'
        },
        operation: 'activity',
        actioningUser: {
          username: 'Developer',
          displayname: 'Developer'
        },
        timestamp: '2024-02-14T15:12:41.937Z',
        type: 'uk.gov.defra.ddi.event.activity',
        rowKey: '0a750a1a-bab9-41fb-beea-8e4ea2d842c1|1707837161937',
        subject: 'DDI Activity Police correspondence'
      }
    ]
  }
  getEvents.mockResolvedValue(validEvent)

  test('GET /cdo/view/activity route returns a 200 and valid content', async () => {
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

    expect(getEvents).toBeCalledWith(['ED123'])
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
    expect(rows.length).toBe(2)
    expect(rows[0].querySelectorAll('.govuk-table__cell')[0].textContent.trim()).toBe('14 February 2024')
    expect(rows[0].querySelectorAll('.govuk-table__cell')[1].textContent.trim()).toBe('Police correspondence received')
    expect(rows[0].querySelectorAll('.govuk-table__cell')[2].textContent.trim()).toBe('Mr Developer')
  })

  test('GET /cdo/view/activity route returns a 200 and message given no activities exist', async () => {
    getCdo.mockResolvedValue({
      dog: {
        id: 300000,
        indexNumber: 'ED300000',
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
  test('GET /cdo/view/activity route returns 404 if no dog data found', async () => {
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
})
