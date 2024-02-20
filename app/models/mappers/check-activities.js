const { formatToGds } = require('../../lib/date-helpers')
const { cleanUserDisplayName } = require('../../lib/model-helpers')

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
 * @typedef {[AuditKey, DateString, DateString]} DateChangedAudit
 */
/**
 * @typedef {[AuditKey, number, number]} IdChangedAudit
 */
/**
 * @typedef {[string, string]} RemovedAudit
 */
/**
 * @typedef {DateChangedAudit|IdChangedAudit} AuditFieldRecord
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
 * @typedef CreatedEventBase
 * @property {'uk.gov.defra.ddi.event.create'} type
 * @property {Object} created
 *
 * @typedef {CreatedEventBase & EventBase} CreatedEvent
 */
/**
 * @typedef {ChangeEvent|ActivityEvent|CreatedEvent} DDIEvent
 */
/**
 * @param {ActivityEvent} event
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
 * @param {DDIEvent} event
 * @returns {Omit<ActivityRow, 'activityLabel'>}
 */
const getDateAndTeamMemberFromEvent = (event) => {
  const date = event.activity?.activityDate || event.timestamp

  return {
    date: formatToGds(date),
    teamMember: cleanUserDisplayName(event.actioningUser.displayname)
  }
}

/**
 * @param {AuditFieldRecord} auditFieldRecord
 * @returns {boolean}
 */
const filterSameDate = (auditFieldRecord) => {
  const [, before, after] = auditFieldRecord

  if (before === after) {
    return false
  }

  if (typeof before === 'string' && !isNaN(new Date(before).getTime())) {
    return new Date(before).getTime() !== new Date(after).getTime()
  }

  return true
}

const addedEvents = ['date_exported', 'date_stolen', 'dog_date_of_death', 'date_untraceable']

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
  removed_from_cdo_process: 'Removed from CDO process',
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
  status: 'Status set to'
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

  if (activityLabels[fieldValue]) {
    return `${activityLabels[fieldValue]} ${eventType}`
  }
  return 'N/A'
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
    const activityLabel = getActivityLabelFromAuditFieldRecord(changeType)(changeRecord)

    if (filterSameDate(changeRecord) && activityLabel !== 'N/A') {
      const activityRow = { ...activityRowInfo, activityLabel }
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

    return [...activityRows, ...addedRows]
  }, activityRowsAccumulator)
}

module.exports = {
  filterSameDate,
  mapActivityDtoToCheckActivityRow,
  getActivityLabelFromEvent,
  mapAuditedChangeEventToCheckActivityRows,
  getActivityLabelFromAuditFieldRecord,
  flatMapActivityDtoToCheckActivityRow
}
