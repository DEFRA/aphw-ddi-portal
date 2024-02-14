const validEvent = {
  events: [
    {
      activity: {
        activity: '4',
        activityType: 'received',
        pk: 'ED300000',
        source: 'dog',
        activityDate: '2024-02-13T00:00:00.000Z',
        activityLabel: 'Police correspondence'
      },
      actioningUser: {
        username: 'Developer',
        displayname: 'Developer'
      },
      timestamp: '2024-02-13T15:12:41.937Z',
      type: 'uk.gov.defra.ddi.event.activity',
      rowKey: '0a750a1a-bab9-41fb-beea-8e4ea2d842c1|1707837161937',
      subject: 'DDI Activity Police correspondence'
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
    }
  ]
}

describe('event', () => {
  test('test', () => {
    console.log(validEvent)
    expect(true).toBe(true)
  })
})
