const { formatToGds } = require('../../lib/date-helpers')
const { cleanUserDisplayName } = require('../../lib/model-helpers')
const { getNewStatusLabel } = require('../../lib/status-helper')

/**
 * @typedef User
 * @property {string} username
 * @property {string} displayname
 */

/**
 * @typedef {string} AuditKey
 */
/**
 * @typedef {string} DateString
 */

/**
 * @typedef {[AuditKey, DateString|null, DateString|null]} DateChangedAudit
 * @typedef {[AuditKey, number|null, number|null]} IdChangedAudit
 * @typedef {[AuditKey, string|null, string|null]} StringChangedAudit
 */
/**
 * @typedef {[string, string]} RemovedAudit
 */
/**
 * @typedef {DateChangedAudit|IdChangedAudit|StringChangedAudit} AuditFieldRecord
 */
/**
 * @typedef Changes
 * @property {AuditFieldRecord[]} added
 * @property {RemovedAudit[]} removed
 * @property {AuditFieldRecord[]} edited
 */
/**
 * @typedef EventBase
 * @property {User} actioningUser
 * @property {string} operation
 * @property {DateString} timestamp
 * @property {string} type
 * @property {string} rowKey
 * @property {string} subject
 */
/**
 * @typedef Activity
 * @property {string} activity
 * @property {string} activityType
 * @property {string} pk
 * @property {string} source
 * @property {string} activityDate
 * @property {string} activityLabel
 */

/**
 * @typedef ChangeEventBase
 * @property {Changes} changes
 * @property {'uk.gov.defra.ddi.event.update'} type
 *
 * @typedef {EventBase & ChangeEventBase} ChangeEvent
 */
/**
 * @typedef ActivityEventBase
 * @property {Activity} activity
 * @property {'uk.gov.defra.ddi.event.activity'} type
 *
 * @typedef {ActivityEventBase & EventBase} ActivityEvent
 */

/**
 * @typedef DogBreed
 * @property {string} breed
 */
/**
 * @typedef CdoStatus
 * @property {number} id
 * @property {string} status
 * @property {string} status_type
 */
/**
 * @typedef CdoRegistration
 * @typedef {number} id
 * @typedef {number} dog_id
 * @typedef {number} status_id
 * @typedef {number} police_force_id
 * @typedef {null|number} court_id
 * @typedef {number} exemption_order_id
 * @typedef {string} created_on
 * @typedef {string} cdo_issued
 * @typedef {string} cdo_expiry
 * @typedef {null|string} time_limit
 * @typedef {null|string} certificate_issued
 * @typedef {string} legislation_officer - "",
 * @typedef {null|string} application_fee_paid
 * @typedef {null|string} neutering_confirmation
 * @typedef {null|string} microchip_verification
 * @typedef {null|string} joined_exemption_scheme
 * @typedef {null|string} withdrawn
 * @typedef {null|string} typed_by_dlo
 * @typedef {null|string} microchip_deadline
 * @typedef {null|string} neutering_deadline
 * @typedef {null|string} non_compliance_letter_sent
 * @typedef {{ "name": string }} police_force
 * @typedef {{ name: null|string }} court
 */
/**
 * @typedef OwnerAddress
 * @property {number} id
 * @property {string} address_line_1
 * @property {string|null} address_line_2
 * @property {string} town
 * @property {string} postcode
 * @property {null} county
 * @property {number} country_id
 * @property {{ country: string }} country
 */
/**
 * @typedef OwnerCreatedEvent
 * @property {number} id
 * @property {string} first_name
 * @property {string} last_name
 * @property {string|null} birth_date
 * @property {string} person_reference
 * @property {OwnerAddress} address
 */
/**
 * @typedef CreatedDogEvent
 * @property {number|null} id
 * @property {string} dog_reference
 * @property {string} index_number
 * @property {number} dog_breed_id
 * @property {number} status_id
 * @property {string} name
 * @property {string|null} birth_date
 * @property {string|null} death_date
 * @property {string|null} tattoo
 * @property {string|null} colour
 * @property {string|null} sex
 * @property {string|null} exported_date
 * @property {string|null} stolen_date
 * @property {string|null} untraceable_date
 * @property {DogBreed} dog_breed
 * @property {CdoStatus} [status]
 * @property {CdoRegistration} registration
 */
/**
 * @typedef CdoCreation
 * @property {CreatedDogEvent} [dog]
 * @property {CreatedDogEvent[]} [dogs]
 * @property {OwnerCreatedEvent} owner
 */
/**
 * @typedef CreatedEventBase
 * @property {'uk.gov.defra.ddi.event.create'} type
 * @property {CdoCreation} created
 *
 * @typedef {CreatedEventBase & EventBase} CreatedEvent
 */

/**
 * @typedef {ChangeEvent|ActivityEvent|CreatedEvent} DDIEvent
 */

/**
 * @typedef LegacyDDIEventBase
 * @property {never} actioningUser
 * @property {string} username
 *
 * @typedef {DDIEvent & LegacyDDIEvent} LegacyDDIEvent
 */

/**
 * @param {DDIEvent} event
 * @returns {string}
 */
const getActivityLabelFromEvent = (event) => {
  if (event.type !== 'uk.gov.defra.ddi.event.activity') {
    return 'NOT YET DEFINED'
  }

  if (event.activity?.activityType) {
    return `${event.activity?.activityLabel} ${event.activity?.activityType}`
  }
  return 'NOT YET DEFINED'
}
/**
 * @typedef ActivityRow
 * @property {string} activityLabel
 * @property {string} date
 * @property {string} teamMember
 */

/**
 * @param {DDIEvent|LegacyDDIEvent} event
 * @returns {Omit<ActivityRow, 'activityLabel'>}
 */
const getDateAndTeamMemberFromEvent = (event) => {
  const date = event.activity?.activityDate || event.added?.cdo_issued || event.timestamp

  return {
    date: formatToGds(date),
    teamMember: cleanUserDisplayName(event.actioningUser.displayname)
  }
}

/**
 * @param {string|undefined|number|null} item
 * @returns {string|number|null}
 */
const turnUndefinedOrEmptyToNull = (item) => {
  if (item === undefined || item === '') {
    return null
  }
  return item
}

/**
 * @param {AuditFieldRecord} auditFieldRecord
 * @returns {boolean}
 */
const filterNonUpdatedFields = (auditFieldRecord) => {
  const [, before, after] = auditFieldRecord

  // null, empty string and undefined should be the same
  if (turnUndefinedOrEmptyToNull(before) === turnUndefinedOrEmptyToNull(after)) {
    return false
  }

  // Date same
  if (typeof before === 'string' && !isNaN(new Date(before).getTime())) {
    return new Date(before).getTime() !== new Date(after).getTime()
  }

  return true
}

/**
 * @param {string} label
 * @returns {boolean}
 */
const shouldShowPreviousValue = (label) => {
  return labelsRequiringPreviousValue.indexOf(label) > -1
}

const labelsRequiringPreviousValue = ['First name', 'Last name', 'Address line 1', 'Address line 2', 'Town or city', 'Postcode']

const addedEvents = ['date_exported', 'date_stolen', 'dog_date_of_death', 'date_untraceable']

const activitiesWhereLabelOnly = ['removed_from_cdo_process', 'non_compliance_letter_sent']

const activityLabels = {
  cdo_issued: 'CDO issue date',
  cdo_expiry: 'CDO expiry date',
  certificate_issued: 'First certificate date',
  application_fee_paid: 'Application fee paid date',
  insurance_company: 'Insurance company',
  insurance_renewal_date: 'Insurance renewal date',
  neutering_confirmation: 'Neutering confirmed',
  microchip_verification: 'Microchip number verified',
  joined_exemption_scheme: 'Joined interim exemption scheme',
  removed_from_cdo_process: 'Non-compliance letter sent',
  non_compliance_letter_sent: 'Non-compliance letter sent',
  court: 'Court',
  legislation_officer: 'Dog legislation officer',
  police_force: 'Police force',
  microchip_deadline: 'Microchip deadline',
  withdrawn: 'Withdrawn from index',
  dog_name: 'Dog name',
  breed_type: 'Breed type',
  colour: 'Dog colour',
  sex: 'Sex',
  dog_date_of_birth: 'Dog date of birth',
  dog_date_of_death: 'Dog date of death',
  tattoo: 'Tattoo',
  microchip1: 'Microchip number 1',
  microchip2: 'Microchip number 2',
  date_exported: 'Date exported',
  date_stolen: 'Date stolen',
  date_untraceable: 'Date untraceable',
  typed_by_dlo: 'Examined by dog legislation officer',
  exemption_order: 'Order type',
  firstName: 'First name',
  lastName: 'Last name',
  birthDate: 'Owner date of birth',
  'address/addressLine1': 'Address line 1',
  'address/addressLine2': 'Address line 2',
  'address/town': 'Town or city',
  'address/postcode': 'Postcode',
  'address/country': 'Country',
  'contacts/email': 'Email address',
  'contacts/primaryTelephone': 'Telephone 1',
  'contacts/secondaryTelephone': 'Telephone 2',
  status: 'Dog status set to'
}

/**
 * @typedef GetActivityLabelFromAuditFieldRecordFn
 * @param {AuditFieldRecord} auditFieldRecord
 * @returns {string}
 */

/**
 * @param {string} eventType
 * @returns {GetActivityLabelFromAuditFieldRecordFn}
 */
const getActivityLabelFromAuditFieldRecord = (eventType) => (auditFieldRecord) => {
  const [fieldValue] = auditFieldRecord
  const label = activityLabels[fieldValue]

  if (label) {
    const [, prevValue] = auditFieldRecord
    const prevValueTranslated = fieldValue === 'status' ? translateStatusText(prevValue) : prevValue
    const postValueTranslated = fieldValue === 'status' ? translateStatusText(eventType) : eventType

    return shouldShowPreviousValue(label) ? `${label} ${postValueTranslated} from ${prevValueTranslated}` : `${label} ${postValueTranslated}`
  }

  return 'N/A'
}

/**
 * @param {CreatedDogEvent} createdDogEvent
 * @returns {string}
 */
const getActivityLabelFromCreatedDog = (createdDogEvent) => {
  const status = createdDogEvent.status?.status ? ` (${getNewStatusLabel({ status: createdDogEvent.status.status })})` : ''
  return `Dog record created${status}`
}

/**
 * @param {[string, string][]} breaches
 * @return {string[]}
 */
const mapBreachesToArray = (breaches) => {
  return breaches.reduce((filteredBreaches, breach) => {
    const [key, label] = breach
    const dogBreachRgx = /dog_breaches\/\d+\[]/
    if (dogBreachRgx.test(key)) {
      return [...filteredBreaches, [label]]
    }
    return filteredBreaches
  }, [])
}

/**
 * @param {string[, ,]} edited
 * @returns {string}
 */
const getInactiveSubStatus = (edited) => {
  const prefix = 'Dog status set to'
  if (edited) {
    for (const edit of edited) {
      const [fieldName, , updatedTo] = edit
      if (fieldName === 'dog_date_of_death' && updatedTo) {
        return `${prefix} Dog dead`
      } else if (fieldName === 'date_exported' && updatedTo) {
        return `${prefix} Dog exported`
      } else if (fieldName === 'date_stolen' && updatedTo) {
        return `${prefix} Reported stolen`
      } else if (fieldName === 'date_untraceable' && updatedTo) {
        return `${prefix} Owner untraceable`
      }
    }
  }
  return `${prefix} Inactive`
}

/**
 * @param {string} status
 * @returns {string}
 */
const translateStatusText = (status) => {
  if (status === 'Failed') {
    return 'Failed to exempt dog'
  }
  if (status === 'Withdrawn') {
    return 'Withdrawn by owner'
  }
  if (status === 'Pre-exempt') {
    return 'Applying for exemption'
  }
  return status
}

/**
 * @param {ChangeEvent} event
 * @returns {ActivityRow[]}
 */
const mapAuditedChangeEventToCheckActivityRows = (event) => {
  const activityRowInfo = getDateAndTeamMemberFromEvent(event)

  const auditedFieldRecords = event.changes.edited

  /**
   * @type {ActivityRow[]}
   */
  const activityRows = []

  return auditedFieldRecords.reduce((activityRows, changeRecord) => {
    let changeType = addedEvents.includes(changeRecord[0]) ? 'added' : 'updated'

    if (changeRecord[0] === 'status') {
      const [,, statusName] = changeRecord
      changeType = statusName
    }

    if (activitiesWhereLabelOnly.includes(changeRecord[0])) {
      changeType = ''
    }

    const childList = changeType === 'In breach' ? mapBreachesToArray(event.changes.added) : []

    const activityLabel = changeType === 'Inactive' ? getInactiveSubStatus(event.changes.edited) : getActivityLabelFromAuditFieldRecord(changeType)(changeRecord)

    if (filterNonUpdatedFields(changeRecord) && activityLabel !== 'N/A') {
      const activityRow = { ...activityRowInfo, activityLabel, childList }
      return [...activityRows, activityRow]
    }

    return [...activityRows]
  }, activityRows)
}

/**
 * @param {DDIEvent} event
 * @returns {ActivityRow}
 */
const mapActivityDtoToCheckActivityRow = (event) => {
  return {
    activityLabel: getActivityLabelFromEvent(event),
    ...getDateAndTeamMemberFromEvent(event)
  }
}

/**
 * @param {CreatedEvent} event
 * @returns {ActivityRow[]}
 */
const mapCreatedEventToCheckActivityRows = (event) => {
  const dateAndTeamMemberData = getDateAndTeamMemberFromEvent(event)

  return [{
    activityLabel: getActivityLabelFromCreatedDog(event.created.dog || event.created.dogs[0]),
    ...dateAndTeamMemberData
  }]
}

/**
 * @param {ImportEvent} event
 * @returns {ActivityRow[]}
 */
const mapImportEventToCheckActivityRows = (event) => {
  const dateAndTeamMemberData = getDateAndTeamMemberFromEvent(event)

  return [{
    activityLabel: `Comments made by index users: ${event.added?.comment}`,
    ...dateAndTeamMemberData
  }]
}

/**
 * @param {ImportEvent} event
 * @returns {ActivityRow[]}
 */
const mapImportManualEventToCheckActivityRows = (event) => {
  const dateAndTeamMemberData = getDateAndTeamMemberFromEvent(event)

  return [{
    activityLabel: 'Record imported',
    ...dateAndTeamMemberData
  }]
}

/**
 * @param {CreatedEvent} event
 * @returns {ActivityRow[]}
 */
const mapCertificateEventToCheckActivityRows = (event) => {
  const dateAndTeamMemberData = getDateAndTeamMemberFromEvent(event)

  return [{
    activityLabel: 'Certificate issued',
    ...dateAndTeamMemberData
  }]
}

/**
 * @param {ChangeOwnerEvent} event
 * @returns {ActivityRow[]}
 */
const mapChangeOwnerEventToCheckActivityRows = (event) => {
  const dateAndTeamMemberData = getDateAndTeamMemberFromEvent(event)

  return [{
    activityLabel: event.details,
    ...dateAndTeamMemberData
  }]
}

/**
 * @param {DDIEvent[]} events
 * @returns {ActivityRow[]}
 */
const flatMapActivityDtoToCheckActivityRow = (events) => {
  /**
   * @type {ActivityRow[]}
   */
  const activityRowsAccumulator = []
  return events.reduce((activityRows, event) => {
    /**
     * @type {ActivityRow[]}
     */
    const addedRows = []

    if (event.type === 'uk.gov.defra.ddi.event.activity') {
      addedRows.push(mapActivityDtoToCheckActivityRow(event))
    }

    if (event.type === 'uk.gov.defra.ddi.event.update') {
      addedRows.push(...mapAuditedChangeEventToCheckActivityRows(event))
    }

    if (event.type === 'uk.gov.defra.ddi.event.create') {
      addedRows.push(...mapCreatedEventToCheckActivityRows(event))
    }

    if (event.type === 'uk.gov.defra.ddi.event.import') {
      addedRows.push(...mapImportEventToCheckActivityRows(event))
    }

    if (event.type === 'uk.gov.defra.ddi.event.import.manual') {
      addedRows.push(...mapImportManualEventToCheckActivityRows(event))
    }

    if (event.type === 'uk.gov.defra.ddi.event.certificate.issued') {
      addedRows.push(...mapCertificateEventToCheckActivityRows(event))
    }

    if (event.type === 'uk.gov.defra.ddi.event.change.owner') {
      addedRows.push(...mapChangeOwnerEventToCheckActivityRows(event))
    }

    return [...activityRows, ...addedRows]
  }, activityRowsAccumulator)
}

module.exports = {
  filterNonUpdatedFields,
  mapActivityDtoToCheckActivityRow,
  getActivityLabelFromEvent,
  mapAuditedChangeEventToCheckActivityRows,
  getActivityLabelFromAuditFieldRecord,
  flatMapActivityDtoToCheckActivityRow,
  getActivityLabelFromCreatedDog,
  mapCreatedEventToCheckActivityRows,
  mapImportEventToCheckActivityRows,
  mapImportManualEventToCheckActivityRows,
  mapCertificateEventToCheckActivityRows,
  mapChangeOwnerEventToCheckActivityRows,
  mapBreachesToArray,
  getInactiveSubStatus,
  translateStatusText
}
