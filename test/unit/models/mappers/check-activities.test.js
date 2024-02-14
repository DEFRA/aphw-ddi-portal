const { mapActivityDtoToCheckActivityRow, getActivityLabelFromEvent } = require('../../../../app/models/mappers/check-activities')
describe('Check Activity Mappers', () => {
  describe('getActivityLabelFromEvent', () => {
    const activities = [
      {
        event: {
          activity: {
            activityType: 'received',
            activityLabel: 'Police correspondence'
          },
          operation: 'activity',
          type: 'uk.gov.defra.ddi.event.activity'
        },
        expected: 'Police correspondence received'
      },
      {
        event: {
          activity: {
            activityType: 'sent',
            activityLabel: 'Change of address form'
          },
          operation: 'activity',
          type: 'uk.gov.defra.ddi.event.activity'
        },
        expected: 'Change of address form sent'
      },
      {
        event: {
          activity: {
            activityType: 'sent',
            activityLabel: 'Death of dog form'
          },
          operation: 'activity',
          type: 'uk.gov.defra.ddi.event.activity'
        },
        expected: 'Death of dog form sent'
      },
      {
        event: {
          activity: {
            activityType: 'sent',
            activityLabel: 'Witness statement'
          },
          operation: 'activity',
          type: 'uk.gov.defra.ddi.event.activity'
        },
        expected: 'Witness statement sent'
      },
      {
        event: {
          activity: {
            activityType: 'received',
            activityLabel: 'Witness statement request'
          },
          operation: 'activity',
          type: 'uk.gov.defra.ddi.event.activity'
        },
        expected: 'Witness statement request received'
      },
      {
        event: {
          activity: {
            activityType: 'received',
            activityLabel: 'Judicial review notice'
          },
          operation: 'activity',
          type: 'uk.gov.defra.ddi.event.activity'
        },
        expected: 'Judicial review notice received'
      }
    ]

    test.each(activities)('should correctly map activity given label is $expected', ({ event, expected }) => {
      expect(getActivityLabelFromEvent(event)).toBe(expected)
    })
    test('should fail safely if event is not an activity', () => {
      expect(getActivityLabelFromEvent({
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
      })).toBe('NOT YET DEFINED')
    })
    test('should return NOT YET DEFINED given activity is not defined', () => {
      expect(getActivityLabelFromEvent({
        type: 'uk.gov.defra.ddi.event.activity',
        activity: {
          activityType: 'received',
          activityLabel: 'New activity type'
        }
      })).toBe('NOT YET DEFINED')
    })
    test('should return NOT YET DEFINED given activity type is invalid', () => {
      expect(getActivityLabelFromEvent({
        type: 'uk.gov.defra.ddi.event.activity',
        activity: {
          activityType: 'unknown',
          activityLabel: 'Judicial review'
        }
      })).toBe('NOT YET DEFINED')
    })
    test('should return NOT YET DEFINED given activity is undefined', () => {
      expect(getActivityLabelFromEvent({
        type: 'uk.gov.defra.ddi.event.activity'
      })).toBe('NOT YET DEFINED')
    })
  })
  describe('mapActivityDtoToCheckActivityRow', () => {
    test('should map a received activity', () => {
      const activity = {
        activity: {
          activity: '4',
          activityType: 'received',
          pk: 'ED300000',
          source: 'dog',
          activityDate: '2024-02-13T00:00:00.000Z',
          activityLabel: 'Police correspondence'
        },
        operation: 'activity',
        actioningUser: {
          username: 'Developer',
          displayname: 'Developer'
        },
        timestamp: '2024-02-13T15:12:41.937Z',
        type: 'uk.gov.defra.ddi.event.activity',
        rowKey: '0a750a1a-bab9-41fb-beea-8e4ea2d842c1|1707837161937',
        subject: 'DDI Activity Police correspondence'
      }
      const expectedActivityRow = {
        date: '13 February 2024',
        activityLabel: 'Police correspondence received',
        teamMember: 'Developer'
      }
      expect(mapActivityDtoToCheckActivityRow(activity)).toEqual(expectedActivityRow)
    })
  })
})
