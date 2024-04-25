/**
 * @param {Omit<Partial<ChangeEvent>, 'changes'> & { changes?: Partial<Changes>}} partialExemption
 * @returns {ChangeEvent}
 */
const auditedEventBuilder = (partialExemption = {}) => {
  return {
    actioningUser: {
      username: 'dev@test.com',
      displayname: 'Developer, Robert'
    },
    operation: 'updated exemption',
    timestamp: '2024-02-19T10:16:53.894Z',
    type: 'uk.gov.defra.ddi.event.update',
    rowKey: 'ff2a5e13-1530-427f-806a-d85b729d7504|1708337813894',
    subject: 'DDI Update exemption',
    ...partialExemption,
    changes: {
      added: partialExemption.changes?.added || [],
      removed: partialExemption.changes?.removed || [],
      edited: partialExemption.changes?.edited || []
    }
  }
}

/**
 * @param {Partial<ActivityEvent>} partialActivityEvent
 * @returns {ActivityEvent}
 */
const manualActivityEventBuilder = (partialActivityEvent = {}) => {
  return {
    activity: {
      activity: '5',
      activityType: 'received',
      pk: 'ED300000',
      source: 'dog',
      activityDate: '2024-02-15T00:00:00.000Z',
      activityLabel: 'Police correspondence'
    },
    operation: 'activity',
    actioningUser: {
      username: 'Developer',
      displayname: 'Developer'
    },
    timestamp: '2024-02-15T16:12:41.937Z',
    type: 'uk.gov.defra.ddi.event.activity',
    rowKey: '0a750a1a-bab9-41fb-beea-8e4ea2d842c1|1707837161937',
    subject: 'DDI Activity Police correspondence',
    ...partialActivityEvent
  }
}

/**
 *
 * @param {Partial<OwnerCreatedEvent>} [partialOwnerCreatedEvent]
 * @returns {OwnerCreatedEvent}
 */
const createdOwnerEventBuilder = (partialOwnerCreatedEvent = {}) => {
  return {
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
    },
    ...partialOwnerCreatedEvent
  }
}
/**
 *
 * @param {Partial<CreatedDogEvent>} [partialCreatedDogEvent]
 * @returns {CreatedDogEvent}
 */
const createdDogEventBuilder = (partialCreatedDogEvent = {}) => {
  return {
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
      non_compliance_letter_sent: null,
      police_force: {
        name: 'Avon and Somerset Constabulary'
      },
      court: {
        name: 'Bristol Magistrates\' Court'
      }
    },
    ...partialCreatedDogEvent
  }
}
/**
 *
 * @param {Partial<CreatedEvent>} [partialCreatedEvent]
 * @returns {CreatedEvent}
 */
const createdEventBuilder = (partialCreatedEvent = {}) => {
  return {
    actioningUser: {
      username: 'dev@test.com',
      displayname: 'Developer'
    },
    operation: 'created cdo',
    created: {
      owner: createdOwnerEventBuilder(),
      dog: createdDogEventBuilder()
    },
    timestamp: '2024-02-14T08:24:22.487Z',
    type: 'uk.gov.defra.ddi.event.create',
    rowKey: 'df2ffe61-9024-43f0-a05f-74022a73847e|1707899062487',
    subject: 'DDI Create cdo',
    ...partialCreatedEvent
  }
}

module.exports = {
  manualActivityEventBuilder,
  auditedEventBuilder,
  createdEventBuilder,
  createdOwnerEventBuilder,
  createdDogEventBuilder
}
