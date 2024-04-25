const {
  mapAuditedChangeEventToCheckActivityRows,
  flatMapActivityDtoToCheckActivityRow,
  getActivityLabelFromAuditFieldRecord,
  mapActivityDtoToCheckActivityRow,
  filterNonUpdatedFields,
  getActivityLabelFromEvent,
  getActivityLabelFromCreatedDog,
  mapCreatedEventToCheckActivityRows,
  mapImportEventToCheckActivityRows
} = require('../../../../app/models/mappers/check-activities')
const { auditedEventBuilder, createdEventBuilder, createdOwnerEventBuilder, createdDogEventBuilder } = require('../../../mocks/activity')

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
      expect(getActivityLabelFromEvent(createdEventBuilder())).toBe('NOT YET DEFINED')
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

    test('should map a received import event', () => {
      const event = {
        timestamp: '2024-02-14T08:24:22.487Z',
        type: 'uk.gov.defra.ddi.event.import',
        subject: 'DDI Import Comment',
        operation: 'added comment',
        added: {
          id: 2,
          comment: 'Comment text',
          cdo_issued: '2010-02-22'
        },
        actioningUser: {
          username: 'Developer',
          displayname: 'DeveloperName'
        },
        rowKey: '0a750a1a-bab9-41fb-beea-8e4ea2d842c1|1707837161936'
      }
      const expectedActivityRow = [{
        date: '22 February 2010',
        activityLabel: 'Comments made by index users: Comment text',
        teamMember: 'DeveloperName'
      }]
      expect(mapImportEventToCheckActivityRows(event)).toEqual(expectedActivityRow)
    })
  })

  describe('filterNonUpdatedFields', () => {
    test('should return true given numbers are different', () => {
      const auditFieldRecord = [
        'court_id',
        1,
        2
      ]
      expect(filterNonUpdatedFields(auditFieldRecord)).toBe(true)
    })
    test('should return false given numbers are the same', () => {
      const auditFieldRecord = [
        'court_id',
        1,
        1
      ]
      expect(filterNonUpdatedFields(auditFieldRecord)).toBe(false)
    })
    test('should return true given strings are different', () => {
      const auditFieldRecord = [
        'legislation_officer',
        'test',
        'test2'
      ]
      expect(filterNonUpdatedFields(auditFieldRecord)).toBe(true)
    })
    test('should return false given strings are the same', () => {
      const auditFieldRecord = [
        'legislation_officer',
        'test',
        'test'
      ]
      expect(filterNonUpdatedFields(auditFieldRecord)).toBe(false)
    })

    test('should return true given dates are different', () => {
      const auditFieldRecord = [
        'cdo_issued',
        '2024-01-15',
        '2024-01-16T00:00:00.000Z'
      ]
      expect(filterNonUpdatedFields(auditFieldRecord)).toBe(true)
    })

    test('should return false given two nulls', () => {
      const auditFieldRecord = [
        'cdo_issued',
        null,
        null
      ]
      expect(filterNonUpdatedFields(auditFieldRecord)).toBe(false)
    })

    test('should return false given dates are the same', () => {
      const auditFieldRecord = [
        'cdo_issued',
        '2024-01-15',
        '2024-01-15T00:00:00.000Z'
      ]
      expect(filterNonUpdatedFields(auditFieldRecord)).toBe(false)
    })

    test('should return false given values are null, empty string', () => {
      const auditFieldRecord = [
        'field_record',
        null,
        ''
      ]
      expect(filterNonUpdatedFields(auditFieldRecord)).toBe(false)
    })
    test('should return false given values are empty string, null', () => {
      const auditFieldRecord = [
        'field_record',
        '',
        null
      ]
      expect(filterNonUpdatedFields(auditFieldRecord)).toBe(false)
    })
    test('should return false given values are undefined, null', () => {
      const auditFieldRecord = [
        'field_record',
        undefined,
        null
      ]
      expect(filterNonUpdatedFields(auditFieldRecord)).toBe(false)
    })
    test('should return false given values are empty string, undefined', () => {
      const auditFieldRecord = [
        'field_record',
        '',
        undefined
      ]
      expect(filterNonUpdatedFields(auditFieldRecord)).toBe(false)
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
      ['Non-compliance letter sent updated', 'removed_from_cdo_process', 'updated'],
      ['Non-compliance letter sent updated', 'non_compliance_letter_sent', 'updated'],
      ['Court updated', 'court', 'updated'],
      ['Insurance company updated', 'insurance_company', 'updated'],
      ['Insurance renewal date updated', 'insurance_renewal_date', 'updated'],
      ['Dog legislation officer updated', 'legislation_officer', 'updated'],
      ['Police force updated', 'police_force', 'updated'],
      ['N/A', 'neutering_deadline', 'updated'],
      ['Microchip deadline updated', 'microchip_deadline', 'updated'],
      ['Withdrawn from index updated', 'withdrawn', 'updated'],
      ['Dog name updated', 'dog_name', 'updated'],
      ['Breed type updated', 'breed_type', 'updated'],
      ['Dog colour updated', 'colour', 'updated'],
      ['Sex updated', 'sex', 'updated'],
      ['Dog date of birth updated', 'dog_date_of_birth', 'updated'],
      ['Dog date of death added', 'dog_date_of_death', 'added'],
      ['Tattoo updated', 'tattoo', 'updated'],
      ['Microchip number 1 updated', 'microchip1', 'updated'],
      ['Microchip number 2 updated', 'microchip2', 'updated'],
      ['Date exported added', 'date_exported', 'added'],
      ['Date stolen added', 'date_stolen', 'added'],
      ['Date untraceable added', 'date_untraceable', 'added'],
      ['Examined by dog legislation officer updated', 'typed_by_dlo', 'updated'],
      ['Order type updated', 'exemption_order', 'updated'],
      ['First name updated from 2024-01-15', 'firstName', 'updated'],
      ['Last name updated from 2024-01-15', 'lastName', 'updated'],
      ['Owner date of birth updated', 'birthDate', 'updated'],
      ['Address line 1 updated from 2024-01-15', 'address/addressLine1', 'updated'],
      ['Address line 2 updated from 2024-01-15', 'address/addressLine2', 'updated'],
      ['Town or city updated from 2024-01-15', 'address/town', 'updated'],
      ['Postcode updated from 2024-01-15', 'address/postcode', 'updated'],
      ['Country updated', 'address/country', 'updated'],
      ['Email address updated', 'contacts/email', 'updated'],
      ['Telephone 1 updated', 'contacts/primaryTelephone', 'updated'],
      ['Telephone 2 updated', 'contacts/secondaryTelephone', 'updated'],
      ['Status set to In-breach', 'status', 'In-breach']
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
              'non_compliance_letter_sent',
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
              'non_compliance_letter_sent',
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
          activityLabel: 'Non-compliance letter sent updated'
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

  describe('getActivityLabelFromCreateDog', () => {
    test('should map a created Dog to an activity row', () => {
      /**
       * @type {CreatedDogEvent}
       */
      const createdDog = createdDogEventBuilder({
        status: {
          id: 5,
          status: 'Pre-exempt',
          status_type: 'STANDARD'
        }
      })
      expect(getActivityLabelFromCreatedDog(createdDog)).toBe('Dog record created (Pre-exempt)')
    })
    test('should map a created Dog to an activity row given dog is using legacy event format', () => {
      /**
       * @type {CreatedDogEvent}
       */
      const createdDog = createdDogEventBuilder({
        status: undefined
      })
      expect(getActivityLabelFromCreatedDog(createdDog)).toBe('Dog record created')
    })
  })

  describe('mapCreatedEventToCheckActivityRows', () => {
    test('should map a created event with one dog to a single row array of dog created rows', () => {
      const createdEvent = createdEventBuilder({
        created: {
          owner: createdOwnerEventBuilder(),
          dog: createdDogEventBuilder({
            status: {
              id: 5,
              status: 'Interim Exempt',
              status_type: 'STANDARD'
            }
          })
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
    test('should map a legacy created event with a dog array to a single row array of dog created rows', () => {
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
          added: {
            id: 2,
            comment: 'Comment text',
            cdo_issued: '2010-02-22'
          },
          operation: 'added comment',
          actioningUser: {
            username: 'import-user',
            displayname: 'Import user'
          },
          timestamp: '2024-02-13T15:12:41.937Z',
          type: 'uk.gov.defra.ddi.event.import',
          rowKey: '0a750a1a-bab9-41fb-beea-8e4ea2d842c1|1707837161936',
          subject: 'DDI Import Comment'
        },
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
            dog: createdDogEventBuilder({
              status: {
                status: 'Pre-exempt',
                status_type: '',
                id: 0
              }
            })
          }
        })
      ]

      /**
       * @type {ActivityRow[]}
       */
      const expectedActivityRows = [
        {
          date: '22 February 2010',
          activityLabel: 'Comments made by index users: Comment text',
          teamMember: 'Import user'
        },
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
