const {
  getActivityLabelFromEvent,
  getActivityLabelFromCreatedDog,
  getActivityLabelFromAuditFieldRecord,
  fieldHasBeenUpdated
} = require('../../../../../app/models/mappers/activities/field-mapping')
const { createdEventBuilder, createdDogEventBuilder } = require('../../../../mocks/activity')
describe('label-mapping', () => {
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
      ['First name updated', 'firstName', 'updated'],
      ['Last name updated', 'lastName', 'updated'],
      ['Owner date of birth updated', 'birthDate', 'updated'],
      ['Address line 1 updated', 'address/addressLine1', 'updated'],
      ['Address line 2 updated', 'address/addressLine2', 'updated'],
      ['Town or city updated', 'address/town', 'updated'],
      ['Postcode updated', 'address/postcode', 'updated'],
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

  describe('fieldHasBeenUpdated', () => {
    test('should return true given numbers are different', () => {
      const auditFieldRecord = [
        'court_id',
        1,
        2
      ]
      expect(fieldHasBeenUpdated(auditFieldRecord)).toBe(true)
    })
    test('should return false given numbers are the same', () => {
      const auditFieldRecord = [
        'court_id',
        1,
        1
      ]
      expect(fieldHasBeenUpdated(auditFieldRecord)).toBe(false)
    })
    test('should return true given strings are different', () => {
      const auditFieldRecord = [
        'legislation_officer',
        'test',
        'test2'
      ]
      expect(fieldHasBeenUpdated(auditFieldRecord)).toBe(true)
    })
    test('should return false given strings are the same', () => {
      const auditFieldRecord = [
        'legislation_officer',
        'test',
        'test'
      ]
      expect(fieldHasBeenUpdated(auditFieldRecord)).toBe(false)
    })

    test('should return true given dates are different', () => {
      const auditFieldRecord = [
        'cdo_issued',
        '2024-01-15',
        '2024-01-16T00:00:00.000Z'
      ]
      expect(fieldHasBeenUpdated(auditFieldRecord)).toBe(true)
    })

    test('should return false given two nulls', () => {
      const auditFieldRecord = [
        'cdo_issued',
        null,
        null
      ]
      expect(fieldHasBeenUpdated(auditFieldRecord)).toBe(false)
    })

    test('should return false given dates are the same', () => {
      const auditFieldRecord = [
        'cdo_issued',
        '2024-01-15',
        '2024-01-15T00:00:00.000Z'
      ]
      expect(fieldHasBeenUpdated(auditFieldRecord)).toBe(false)
    })

    test('should return false given values are null, empty string', () => {
      const auditFieldRecord = [
        'field_record',
        null,
        ''
      ]
      expect(fieldHasBeenUpdated(auditFieldRecord)).toBe(false)
    })
    test('should return false given values are empty string, null', () => {
      const auditFieldRecord = [
        'field_record',
        '',
        null
      ]
      expect(fieldHasBeenUpdated(auditFieldRecord)).toBe(false)
    })
    test('should return false given values are undefined, null', () => {
      const auditFieldRecord = [
        'field_record',
        undefined,
        null
      ]
      expect(fieldHasBeenUpdated(auditFieldRecord)).toBe(false)
    })
    test('should return false given values are empty string, undefined', () => {
      const auditFieldRecord = [
        'field_record',
        '',
        undefined
      ]
      expect(fieldHasBeenUpdated(auditFieldRecord)).toBe(false)
    })
  })
})
