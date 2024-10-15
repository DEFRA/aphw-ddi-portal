const {
  mapAuditedChangeEventToCheckActivityRows,
  flatMapActivityDtoToCheckActivityRow,
  getActivityLabelFromAuditFieldRecord,
  mapActivityDtoToCheckActivityRow,
  filterNonUpdatedFields,
  getActivityLabelFromEvent,
  getActivityLabelFromCreatedDog,
  mapCreatedEventToCheckActivityRows,
  mapImportEventToCheckActivityRows,
  mapCertificateEventToCheckActivityRows,
  mapChangeOwnerEventToCheckActivityRows,
  mapBreachesToArray,
  getInactiveSubStatus,
  translateStatusText
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
      ['Dog status set to In breach', 'status', 'In breach']
    ]
    test.each(tests)('should return %s given event is %s', (expected, label, eventType) => {
      expect(getActivityLabelFromAuditFieldRecord(eventType)([
        label,
        '2024-01-15',
        '2024-01-16T00:00:00.000Z'
      ])).toBe(expected)
    })
  })

  describe('mapBreachesToArray', () => {
    test('should map breaches to array', () => {
      const breaches = [
        [
          'dog_breaches/0[]',
          'dog not covered by third party insurance'
        ],
        [
          'dog_breaches/1[]',
          'dog away from registered address for over 30 days in one year'
        ],
        [
          'dog_breaches/2[]',
          'exemption certificate not provided to police'
        ]
      ]

      const expectedBreaches = [
        ['dog not covered by third party insurance'],
        ['dog away from registered address for over 30 days in one year'],
        ['exemption certificate not provided to police']
      ]
      expect(mapBreachesToArray(breaches)).toEqual(expectedBreaches)
    })

    test('should handle non-breaches', () => {
      const breaches = [
        [
          'name',
          'Jack Sparrow'
        ],
        [
          'dog_breaches/0[]',
          'dog not covered by third party insurance'
        ],
        [
          'dog_breaches/1[]',
          'dog away from registered address for over 30 days in one year'
        ],
        [
          'dog_breaches/2[]',
          'exemption certificate not provided to police'
        ]
      ]

      const expectedBreaches = [
        ['dog not covered by third party insurance'],
        ['dog away from registered address for over 30 days in one year'],
        ['exemption certificate not provided to police']
      ]
      expect(mapBreachesToArray(breaches)).toEqual(expectedBreaches)
    })

    test('should handle given no breaches exist', () => {
      const breaches = [
        [
          'name',
          'Jack Sparrow'
        ],
        ['address', 'Caribbean']
      ]

      const expectedBreaches = []
      expect(mapBreachesToArray(breaches)).toEqual(expectedBreaches)
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
          activityLabel: 'CDO issue date updated',
          childList: []
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'CDO expiry date updated',
          childList: []
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'First certificate date updated',
          childList: []
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'Application fee paid date updated',
          childList: []
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'Neutering confirmed updated',
          childList: []
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'Microchip number verified updated',
          childList: []
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'Joined interim exemption scheme updated',
          childList: []
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'Non-compliance letter sent ',
          childList: []
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'Non-compliance letter sent ',
          childList: []
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'Court updated',
          childList: []
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'Dog legislation officer updated',
          childList: []
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'Police force updated',
          childList: []
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'Date exported added',
          childList: []
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'Date stolen added',
          childList: []
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'Dog date of death added',
          childList: []
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'Date untraceable added',
          childList: []
        },
        {
          date: '19 February 2024',
          teamMember: 'Robert Developer',
          activityLabel: 'Dog status set to Applying for exemption',
          childList: []
        }
      ]

      expect(mapAuditedChangeEventToCheckActivityRows(updatedExemption)).toEqual(expectedActivityRows)
    })
    test('should handle In breach categories', () => {
      const updatedDogEvent = auditedEventBuilder({
        operation: 'updated dog',
        changes: {
          added: [
            [
              'dog_breaches/0[]',
              'dog not covered by third party insurance'
            ],
            [
              'dog_breaches/1[]',
              'dog away from registered address for over 30 days in one year'
            ],
            [
              'dog_breaches/2[]',
              'exemption certificate not provided to police'
            ]
          ],
          removed: [],
          edited: [
            [
              'status',
              'Pre-exempt',
              'In breach'
            ],
            [
              'dog_breaches',
              [],
              []
            ]
          ]
        }
      })
      const mappedAuditEvent = mapAuditedChangeEventToCheckActivityRows(updatedDogEvent)[0]
      expect(mappedAuditEvent.activityLabel).toEqual('Dog status set to In breach')
      expect(mappedAuditEvent.childList).toEqual([
        ['dog not covered by third party insurance'],
        ['dog away from registered address for over 30 days in one year'],
        ['exemption certificate not provided to police']
      ])
    })

    test('should handle Inactive sub-status', () => {
      const updatedDogEvent = auditedEventBuilder({
        operation: 'updated dog',
        changes: {
          added: [],
          removed: [],
          edited: [
            [
              'status',
              'Exempt',
              'Inactive'
            ],
            [
              'dog_date_of_death',
              null,
              '2024-10-05'
            ]
          ]
        }
      })
      const mappedAuditEvent = mapAuditedChangeEventToCheckActivityRows(updatedDogEvent)[0]
      expect(mappedAuditEvent.activityLabel).toEqual('Dog status set to Dog dead')
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
      expect(getActivityLabelFromCreatedDog(createdDog)).toBe('Dog record created (Applying for exemption)')
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

  describe('mapCertificateEventToCheckActivityRows', () => {
    test('should map a certificate event', () => {
      const certificateEvent = createdEventBuilder({
        type: 'uk.gov.defra.ddi.event.certificate.issued',
        timestamp: '2024-02-14T08:24:22.487Z',
        actioningUser: {
          username: 'Developer',
          displayname: 'Developer'
        }
      })
      const expectedRows = [
        {
          date: '14 February 2024',
          activityLabel: 'Certificate issued',
          teamMember: 'Developer'
        }
      ]
      expect(mapCertificateEventToCheckActivityRows(certificateEvent)).toEqual(expectedRows)
    })
  })

  describe('flatMapActivityDtoToCheckActivityRow', () => {
    test('should filter and flat map a selection of different events', () => {
      /**
       * @type {DDIEvent[]}
       */
      const items = [
        {
          operation: 'certificate issued',
          actioningUser: {
            username: 'import-user',
            displayname: 'Import user'
          },
          timestamp: '2024-02-13T15:12:41.937Z',
          type: 'uk.gov.defra.ddi.event.certificate.issued',
          rowKey: '0a750a1a-bab9-41fb-beea-8e4ea2d842c1|1707837161935',
          subject: 'DDI Certificate Issued'
        },
        {
          operation: 'changed dog owner',
          actioningUser: {
            username: 'import-user',
            displayname: 'Import user'
          },
          timestamp: '2024-02-13T15:12:41.937Z',
          type: 'uk.gov.defra.ddi.event.change.owner',
          rowKey: '0a750a1a-bab9-41fb-beea-8e4ea2d842c5|1707837161936',
          subject: 'DDI Changed Dog Owner',
          details: 'Dog ED100 moved to John Smith'
        },
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
          imported: {
            id: 2
          },
          operation: 'import record',
          actioningUser: {
            username: 'import-user',
            displayname: 'Import user'
          },
          timestamp: '2024-02-11T15:12:55.937Z',
          type: 'uk.gov.defra.ddi.event.import.manual',
          rowKey: '0a750a1a-bab9-41fb-beea-8e4ea2d842c1|1707837161936',
          subject: 'DDI Record Import'
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
          date: '13 February 2024',
          activityLabel: 'Certificate issued',
          teamMember: 'Import user'
        },
        {
          date: '13 February 2024',
          activityLabel: 'Dog ED100 moved to John Smith',
          teamMember: 'Import user'
        },
        {
          date: '22 February 2010',
          activityLabel: 'Comments made by index users: Comment text',
          teamMember: 'Import user'
        },
        {
          date: '11 February 2024',
          activityLabel: 'Record imported',
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
          teamMember: 'Robert Developer',
          childList: []
        },
        {
          date: '19 February 2024',
          activityLabel: 'CDO expiry date updated',
          teamMember: 'Robert Developer',
          childList: []
        },
        {
          date: '19 February 2024',
          activityLabel: 'First certificate date updated',
          teamMember: 'Robert Developer',
          childList: []
        },
        {
          date: '18 February 2024',
          activityLabel: 'Dog record created (Applying for exemption)',
          teamMember: 'Robert Developer'
        }
      ]

      expect(flatMapActivityDtoToCheckActivityRow(items)).toEqual(expectedActivityRows)
    })
  })

  describe('mapChangeOwnerEventToCheckActivityRows', () => {
    test('should map a created event with one dog to a single row array of dog created rows', () => {
      const createdEvent = createdEventBuilder({
        details: 'Dog ED100 moved to John Smith',
        timestamp: '2024-02-14T08:24:22.487Z',
        actioningUser: {
          username: 'Developer',
          displayname: 'Developer'
        }
      })

      const expectedRows = [
        {
          date: '14 February 2024',
          activityLabel: 'Dog ED100 moved to John Smith',
          teamMember: 'Developer'
        }
      ]
      expect(mapChangeOwnerEventToCheckActivityRows(createdEvent)).toEqual(expectedRows)
    })
  })

  describe('getInactiveSubStatus', () => {
    test('handles no sub status', () => {
      const res = getInactiveSubStatus([])
      expect(res).toBe('Dog status set to Inactive')
    })

    test('handles null', () => {
      const res = getInactiveSubStatus(null)
      expect(res).toBe('Dog status set to Inactive')
    })

    test('handles dog dead', () => {
      const res = getInactiveSubStatus([['dog_date_of_death', null, '2024-05-15']])
      expect(res).toBe('Dog status set to Dog dead')
    })

    test('handles dog exported', () => {
      const res = getInactiveSubStatus([['date_exported', null, '2024-05-15']])
      expect(res).toBe('Dog status set to Dog exported')
    })

    test('handles dog stolen', () => {
      const res = getInactiveSubStatus([['date_stolen', null, '2024-05-15']])
      expect(res).toBe('Dog status set to Reported stolen')
    })

    test('handles dog untraceable', () => {
      const res = getInactiveSubStatus([['date_untraceable', null, '2024-05-15']])
      expect(res).toBe('Dog status set to Owner untraceable')
    })

    test('handles dog Inactive with invalid sub-status', () => {
      const res = getInactiveSubStatus([['date_xxx', null, '2024-05-15']])
      expect(res).toBe('Dog status set to Inactive')
    })
  })

  describe('translateStatusText', () => {
    test('handles no translation', () => {
      const res = translateStatusText('abcdef')
      expect(res).toBe('abcdef')
    })

    test('handles failed', () => {
      const res = translateStatusText('Failed')
      expect(res).toBe('Failed to exempt dog')
    })

    test('handles withdrawn', () => {
      const res = translateStatusText('Withdrawn')
      expect(res).toBe('Withdrawn by owner')
    })

    test('handles pre-exempt', () => {
      const res = translateStatusText('Pre-exempt')
      expect(res).toBe('Applying for exemption')
    })
  })
})
