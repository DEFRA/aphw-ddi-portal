const {
  mapAuditedChangeEventToCheckActivityRows,
  flatMapActivityDtoToCheckActivityRow,
  mapActivityDtoToCheckActivityRow,
  mapCreatedEventToCheckActivityRows
} = require('../../../../../app/models/mappers/activities/check-activities')
const { auditedEventBuilder, createdEventBuilder, createdOwnerEventBuilder, createdDogEventBuilder } = require('../../../../mocks/activity')

describe('Check Activity Mappers', () => {
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

  describe('mapAuditedChangeEventToCheckActivityRows', () => {
    test('should handle updated exemptions given nothing has changed', () => {
      const updatedExemptionEvent = auditedEventBuilder({
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
      const updatedExemption = auditedEventBuilder({
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
      const updatedExemption = auditedEventBuilder({
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
              'court',
              171,
              159
            ],
            [
              'legislation_officer',
              'test',
              'test2'
            ],
            [
              'police_force',
              46,
              45
            ],
            [
              'date_exported',
              '2024-02-17',
              '2024-02-18T00:00:00.000Z'
            ],
            [
              'date_stolen',
              '2024-02-17',
              '2024-02-18T00:00:00.000Z'
            ],
            [
              'dog_date_of_death',
              '2024-02-17',
              '2024-02-18T00:00:00.000Z'
            ],
            [
              'date_untraceable',
              '2024-02-17',
              '2024-02-18T00:00:00.000Z'
            ],
            ['status', 'Inactive', 'Pre-exempt']
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
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'Date exported added'
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'Date stolen added'
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'Dog date of death added'
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'Date untraceable added'
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'Status set to Pre-exempt'
        }
      ]

      expect(mapAuditedChangeEventToCheckActivityRows(updatedExemption)).toEqual(expectedActivityRows)
    })
  })

  describe('mapCreatedEventToCheckActivityRows', () => {
    test('should map a created event with one dog to a single row array of dog created rows', () => {
      const createdEvent = createdEventBuilder({
        created: {
          owner: createdOwnerEventBuilder(),
          dogs: [
            createdDogEventBuilder({
              status: {
                id: 5,
                status: 'Interim Exempt',
                status_type: 'STANDARD'
              }
            })
          ]
        },
        timestamp: '2024-02-14T08:24:22.487Z',
        actioningUser: {
          username: 'Developer',
          displayname: 'Developer'
        }
      })
      const expectedRows = [
        {
          date: '14 February 2024',
          activityLabel: 'Dog record created (Interim Exempt)',
          teamMember: 'Developer'
        }
      ]
      expect(mapCreatedEventToCheckActivityRows(createdEvent)).toEqual(expectedRows)
    })

    test('should map a created event with two dogs to a two row array of dog created rows ', () => {
      const createdEvent = createdEventBuilder({
        created: {
          owner: createdOwnerEventBuilder(),
          dogs: [
            createdDogEventBuilder({
              status: {
                id: 5,
                status: 'Interim Exempt',
                status_type: 'STANDARD'
              }
            }),
            createdDogEventBuilder({
              status: {
                id: 5,
                status: 'Pre-exempt',
                status_type: 'STANDARD'
              }
            })
          ]
        },
        timestamp: '2024-02-14T08:24:22.487Z',
        actioningUser: {
          username: 'Developer',
          displayname: 'Developer'
        }
      })
      const expectedRows = [
        {
          date: '14 February 2024',
          activityLabel: 'Dog record created (Interim Exempt)',
          teamMember: 'Developer'
        },
        {
          date: '14 February 2024',
          activityLabel: 'Dog record created (Pre-exempt)',
          teamMember: 'Developer'
        }
      ]
      expect(mapCreatedEventToCheckActivityRows(createdEvent)).toEqual(expectedRows)
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
        auditedEventBuilder({
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
        }),
        createdEventBuilder({
          timestamp: '2024-02-18T15:12:41.937Z',
          actioningUser: {
            username: 'Developer',
            displayname: 'Developer, Robert'
          },
          created: {
            owner: createdOwnerEventBuilder(),
            dogs: [
              createdDogEventBuilder({
                status: {
                  status: 'Pre-exempt',
                  status_type: '',
                  id: 0
                }
              })
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
        },
        {
          date: '18 February 2024',
          activityLabel: 'Dog record created (Pre-exempt)',
          teamMember: 'Robert Developer'
        }
      ]

      expect(flatMapActivityDtoToCheckActivityRow(items)).toEqual(expectedActivityRows)
    })
  })
})
