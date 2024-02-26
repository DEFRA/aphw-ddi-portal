const { ddiEventsApiProvider } = require('./mockServices')
const { term, eachLike, like, iso8601DateTimeWithMillis, string, iso8601Date } = require('@pact-foundation/pact/dsl/matchers')
const { flatMapActivityDtoToCheckActivityRow } = require('../../app/models/mappers/check-activities')
let eventsApi

describe('Event service contract test', () => {
  describe('/events', () => {
    beforeAll(async () => {
      const mockService = ddiEventsApiProvider
      await mockService.setup()
      jest.mock('../../app/config', () => ({
        ddiEventsApi: mockService.mockService
      }))
      eventsApi = require('../../app/api/ddi-events-api/event')
    })

    const ANY_EVENT = {
      operation: string('activity'),
      actioningUser: like({
        username: 'Developer',
        displayname: 'Developer'
      }),
      timestamp: iso8601DateTimeWithMillis('2024-02-13T15:12:41.937Z'),
      type: term({
        matcher: 'uk.gov.defra.ddi.event.activity|uk.gov.defra.ddi.event.create|uk.gov.defra.ddi.event.update',
        generate: 'uk.gov.defra.ddi.event.activity'
      }),
      rowKey: string('0a750a1a-bab9-41fb-beea-8e4ea2d842c1|1707837161937'),
      subject: string('DDI Activity Police correspondence')
    }

    const SAMPLE_ACTIVITY = {
      ...ANY_EVENT,
      operation: 'activity',
      activity: like({
        activity: '4',
        activityType: 'received',
        pk: 'ED300000',
        source: 'dog',
        activityDate: '2024-02-13T00:00:00.000Z',
        activityLabel: 'Police correspondence'
      }),
      subject: string('DDI Activity Police correspondence')
    }

    const SAMPLE_UPDATED = {
      ...ANY_EVENT,
      operation: string('updated dog'),
      changes: {
        edited: eachLike([
          string('colour'),
          string('Brown'),
          string('Brown and white')
        ], { min: 1 })
      }
    }
    const CREATED_DOG = {
      id: 300002,
      dog_reference: 'a36ba664-9716-4b85-85cd-2b7cfe628cbb',
      index_number: 'ED300002',
      dog_breed_id: 2,
      status_id: 5,
      name: 'Jake',
      dog_breed: like({
        breed: 'Pit Bull Terrier'
      }),
      status: like({
        id: 5,
        status: 'Pre-exempt',
        status_type: 'STANDARD'
      }),
      registration: like({
        id: 3,
        dog_id: 300002,
        status_id: 1,
        police_force_id: 1,
        court_id: 31,
        exemption_order_id: 1,
        created_on: iso8601DateTimeWithMillis('2024-02-14T08:24:22.440Z'),
        cdo_issued: iso8601Date('2024-02-14'),
        cdo_expiry: iso8601Date('2024-04-14'),
        police_force: like({
          name: 'Avon and Somerset Constabulary'
        }),
        court: like({
          name: 'Bristol Magistrates\' Court'
        })
      })
    }
    const SAMPLE_CREATED = {
      ...ANY_EVENT,
      operation: string('created cdo'),
      created: {
        owner: like({
          id: 3,
          first_name: 'John',
          last_name: 'Jeffries',
          person_reference: 'P-57DC-2761',
          address: like({
            id: 5,
            address_line_1: 'FLAT 3, 3 THE LAUREATE, CHARLES STREET',
            town: 'BRISTOL',
            postcode: 'BS1 3DG',
            country_id: 1,
            country: like({
              country: 'England'
            })
          })
        })
      }
    }

    const SAMPLE_CREATED_WITH_DOG = {
      ...SAMPLE_CREATED,
      dog: CREATED_DOG
    }

    const SAMPLE_CREATED_WITH_DOGS = {
      ...SAMPLE_CREATED,
      dog: eachLike(CREATED_DOG, { min: 1 })
    }

    test('GET /events with activity', async () => {
      await ddiEventsApiProvider.addInteraction({
        state: 'activity event exists',
        uponReceiving: 'get all events for primary key',
        withRequest: {
          method: 'GET',
          path: '/events/',
          query: {
            pks: 'ED300000'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: {
            events: eachLike(SAMPLE_ACTIVITY, { min: 1 })
          }
        }
      })

      const response = await eventsApi.getEvents(['ED300000'])
      expect(() => flatMapActivityDtoToCheckActivityRow(response.events)).not.toThrow()
    })

    test('GET /events with updated dog', async () => {
      await ddiEventsApiProvider.addInteraction({
        state: 'updated dog exists',
        uponReceiving: 'get all events for primary key',
        withRequest: {
          method: 'GET',
          path: '/events/',
          query: {
            pks: 'ED300000'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: {
            events: eachLike(SAMPLE_UPDATED, { min: 1 })
          }
        }
      })

      const response = await eventsApi.getEvents(['ED300000'])
      expect(() => flatMapActivityDtoToCheckActivityRow(response.events)).not.toThrow()
    })

    test('GET /events with created dog and owner v1', async () => {
      await ddiEventsApiProvider.addInteraction({
        state: 'v1 created dog and owner exists',
        uponReceiving: 'get all events for primary key',
        withRequest: {
          method: 'GET',
          path: '/events/',
          query: {
            pks: 'ED300000,P-B218-7D57'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: {
            events: eachLike(SAMPLE_CREATED_WITH_DOGS, { min: 1 })
          }
        }
      })

      const response = await eventsApi.getEvents(['ED300000', 'P-B218-7D57'])
      expect(() => flatMapActivityDtoToCheckActivityRow(response.events)).not.toThrow()
    })

    test('GET /events with created dog and owner v2', async () => {
      await ddiEventsApiProvider.addInteraction({
        state: 'v2 created dog and owner exists',
        uponReceiving: 'get all events for primary key',
        withRequest: {
          method: 'GET',
          path: '/events/',
          query: {
            pks: 'ED300000,P-B218-7D57'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: {
            events: eachLike(SAMPLE_CREATED_WITH_DOG, { min: 1 })
          }
        }
      })

      const response = await eventsApi.getEvents(['ED300000', 'P-B218-7D57'])
      expect(() => flatMapActivityDtoToCheckActivityRow(response.events)).not.toThrow()
    })
  })

  afterEach(async () => {
    await ddiEventsApiProvider.verify()
  })

  afterAll(async () => {
    await ddiEventsApiProvider.finalize()
  })
})
