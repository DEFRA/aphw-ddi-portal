const {
  mapAuditedChangeEventToCheckActivityRows,
  flatMapActivityDtoToCheckActivityRow,
  getActivityLabelFromAuditFieldRecord,
  mapActivityDtoToCheckActivityRow,
  filterSameDate,
  getActivityLabelFromEvent
} = require('../../../../app/models/mappers/check-activities')

/**
 * @param {Partial<ChangeEvent>} partialExemption
 * @returns {ChangeEvent}
 */
const exemptionUpdatedEventBuilder = (partialExemption) => {
  return {
    actioningUser: {
      username: 'dev@test.com',
      displayname: 'Developer, Robert'
    },
    operation: 'updated exemption',
    changes: {
      added: [],
      removed: [],
      edited: []
    },
    timestamp: '2024-02-19T10:16:53.894Z',
    type: 'uk.gov.defra.ddi.event.update',
    rowKey: 'ff2a5e13-1530-427f-806a-d85b729d7504|1708337813894',
    subject: 'DDI Update exemption',
    ...partialExemption
  }
}
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
      })).toBe('New activity type received')
    })
    test('should return NOT YET DEFINED given activity type is invalid', () => {
      expect(getActivityLabelFromEvent({
        type: 'uk.gov.defra.ddi.event.activity',
        activity: {
          activityType: 'unknown',
          activityLabel: 'Judicial review'
        }
      })).toBe('Judicial review unknown')
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
          activityDate: '2024-02-12T00:00:00.000Z',
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
        date: '12 February 2024',
        activityLabel: 'Police correspondence received',
        teamMember: 'Developer'
      }
      expect(mapActivityDtoToCheckActivityRow(activity)).toEqual(expectedActivityRow)
    })

    test('should map a received event that is not an activity', () => {
      const event = {
        timestamp: '2024-02-14T08:24:22.487Z',
        type: 'uk.gov.defra.ddi.event.create',
        subject: 'DDI Create cdo',
        operation: 'activity',
        actioningUser: {
          username: 'Developer',
          displayname: 'Developer'
        },
        rowKey: '0a750a1a-bab9-41fb-beea-8e4ea2d842c1|1707837161937'
      }
      const expectedActivityRow = {
        date: '14 February 2024',
        activityLabel: 'NOT YET DEFINED',
        teamMember: 'Developer'
      }
      expect(mapActivityDtoToCheckActivityRow(event)).toEqual(expectedActivityRow)
    })
  })
  describe('filterSameDate', () => {
    test('should return true given numbers are different', () => {
      const auditFieldRecord = [
        'court_id',
        1,
        2
      ]
      expect(filterSameDate(auditFieldRecord)).toBe(true)
    })
    test('should return false given numbers are the same', () => {
      const auditFieldRecord = [
        'court_id',
        1,
        1
      ]
      expect(filterSameDate(auditFieldRecord)).toBe(false)
    })
    test('should return true given strings are different', () => {
      const auditFieldRecord = [
        'legislation_officer',
        'test',
        'test2'
      ]
      expect(filterSameDate(auditFieldRecord)).toBe(true)
    })
    test('should return false given strings are the same', () => {
      const auditFieldRecord = [
        'legislation_officer',
        'test',
        'test'
      ]
      expect(filterSameDate(auditFieldRecord)).toBe(false)
    })

    test('should return true given dates are different', () => {
      const auditFieldRecord = [
        'cdo_issued',
        '2024-01-15',
        '2024-01-16T00:00:00.000Z'
      ]
      expect(filterSameDate(auditFieldRecord)).toBe(true)
    })

    test('should return false given dates are the same', () => {
      const auditFieldRecord = [
        'cdo_issued',
        '2024-01-15',
        '2024-01-15T00:00:00.000Z'
      ]
      expect(filterSameDate(auditFieldRecord)).toBe(false)
    })
  })
  describe('getActivityLabelFromAuditFieldRecord', () => {
    const tests = [
      ['CDO issue date updated', 'cdo_issued', 'updated'],
      ['CDO expiry date updated', 'cdo_expiry', 'updated'],
      ['First certificate date updated', 'certificate_issued', 'updated'],
      ['Application fee paid date updated', 'application_fee_paid', 'updated'],
      ['Neutering confirmed updated', 'neutering_confirmation', 'updated'],
      ['Microchip number verified updated', 'microchip_verification', 'updated'],
      ['Joined interim exemption scheme updated', 'joined_exemption_scheme', 'updated'],
      ['Removed from CDO process updated', 'removed_from_cdo_process', 'updated'],
      ['Court updated', 'court_id', 'updated'],
      ['Dog legislation officer updated', 'legislation_officer', 'updated'],
      ['Police force updated', 'police_force_id', 'updated'],
      ['N/A', 'neutering_deadline', 'updated']
    ]
    test.each(tests)('should return %s given event is %s', (expected, label, eventType) => {
      expect(getActivityLabelFromAuditFieldRecord(eventType)([
        label,
        '2024-01-15',
        '2024-01-16T00:00:00.000Z'
      ])).toBe(expected)
    })
  })
  describe('mapAuditedChangeEventToCheckActivityRows', () => {
    test('should handle updated exemptions given nothing has changed', () => {
      const updatedExemptionEvent = exemptionUpdatedEventBuilder({
        changes: {
          added: [],
          removed: [
            [
              'index_number',
              'ED300000'
            ]
          ],
          edited: [
            [
              'cdo_issued',
              '2024-01-16',
              '2024-01-16T00:00:00.000Z'
            ],
            [
              'cdo_expiry',
              '2024-02-18',
              '2024-02-18T00:00:00.000Z'
            ],
            [
              'certificate_issued',
              '2024-02-19',
              '2024-02-19T00:00:00.000Z'
            ],
            [
              'application_fee_paid',
              '2024-02-18',
              '2024-02-18T00:00:00.000Z'
            ],
            [
              'neutering_confirmation',
              '2024-02-18',
              '2024-02-18T00:00:00.000Z'
            ],
            [
              'microchip_verification',
              '2024-02-18',
              '2024-02-18T00:00:00.000Z'
            ],
            [
              'joined_exemption_scheme',
              '2024-01-01',
              '2024-01-01T00:00:00.000Z'
            ],
            [
              'removed_from_cdo_process',
              '2024-02-18',
              '2024-02-18T00:00:00.000Z'
            ]
          ]
        }
      })

      expect(mapAuditedChangeEventToCheckActivityRows(updatedExemptionEvent)).toEqual([])
    })
    test('should filter out N/A results', () => {
      const updatedExemption = exemptionUpdatedEventBuilder({
        changes: {
          added: [],
          removed: [],
          edited: [
            [
              'unknown_type',
              46,
              45
            ]
          ]
        }
      })

      expect(mapAuditedChangeEventToCheckActivityRows(updatedExemption)).toEqual([])
    })
    test('should handle updated exemptions', () => {
      const updatedExemption = exemptionUpdatedEventBuilder({
        changes: {
          added: [],
          removed: [
            [
              'index_number',
              'ED300000'
            ]
          ],
          edited: [
            [
              'cdo_issued',
              '2024-01-15',
              '2024-01-16T00:00:00.000Z'
            ],
            [
              'cdo_expiry',
              '2024-02-17',
              '2024-02-18T00:00:00.000Z'
            ],
            [
              'certificate_issued',
              '2024-02-18',
              '2024-02-19T00:00:00.000Z'
            ],
            [
              'application_fee_paid',
              '2024-02-17',
              '2024-02-18T00:00:00.000Z'
            ],
            [
              'neutering_confirmation',
              '2024-02-17',
              '2024-02-18T00:00:00.000Z'
            ],
            [
              'microchip_verification',
              '2024-02-17',
              '2024-02-18T00:00:00.000Z'
            ],
            [
              'joined_exemption_scheme',
              '2024-01-31',
              '2024-01-01T00:00:00.000Z'
            ],
            [
              'removed_from_cdo_process',
              '2024-02-17',
              '2024-02-18T00:00:00.000Z'
            ],
            [
              'court_id',
              171,
              159
            ],
            [
              'legislation_officer',
              'test',
              'test2'
            ],
            [
              'police_force_id',
              46,
              45
            ]
          ]
        }
      })

      /**
       *
       * @type {ActivityRow[]}
       */
      const expectedActivityRows = [
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'CDO issue date updated'
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'CDO expiry date updated'
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'First certificate date updated'
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'Application fee paid date updated'
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'Neutering confirmed updated'
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'Microchip number verified updated'
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'Joined interim exemption scheme updated'
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'Removed from CDO process updated'
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'Court updated'
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'Dog legislation officer updated'
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'Police force updated'
        }
      ]

      expect(mapAuditedChangeEventToCheckActivityRows(updatedExemption)).toEqual(expectedActivityRows)
    })
  })
  describe('flatMapActivityDtoToCheckActivityRow', () => {
    test('should filter and flat map a selection of different events', () => {
      /**
       * @type {DDIEvent[]}
       */
      const items = [
        {
          activity: {
            activity: '4',
            activityType: 'received',
            pk: 'ED300000',
            source: 'dog',
            activityDate: '2024-02-12T00:00:00.000Z',
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
        },
        exemptionUpdatedEventBuilder({
          changes: {
            added: [],
            removed: [],
            edited: [
              [
                'cdo_issued',
                '2024-01-15',
                '2024-01-16T00:00:00.000Z'
              ],
              [
                'application_fee_paid',
                '2024-02-18',
                '2024-02-18T00:00:00.000Z'
              ],
              [
                'cdo_expiry',
                '2024-02-17',
                '2024-02-18T00:00:00.000Z'
              ],
              [
                'certificate_issued',
                '2024-02-18',
                '2024-02-19T00:00:00.000Z'
              ]
            ]
          }
        })
      ]

      /**
       * @type {ActivityRow[]}
       */
      const expectedActivityRows = [
        {
          date: '12 February 2024',
          activityLabel: 'Police correspondence received',
          teamMember: 'Developer'
        },
        {
          date: '19 February 2024',
          activityLabel: 'CDO issue date updated',
          teamMember: 'Robert Developer'
        },
        {
          date: '19 February 2024',
          activityLabel: 'CDO expiry date updated',
          teamMember: 'Robert Developer'
        },
        {
          date: '19 February 2024',
          activityLabel: 'First certificate date updated',
          teamMember: 'Robert Developer'
        }
      ]

      expect(flatMapActivityDtoToCheckActivityRow(items)).toEqual(expectedActivityRows)
    })
  })
})
