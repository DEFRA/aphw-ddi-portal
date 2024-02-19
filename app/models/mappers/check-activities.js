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
 * @typedef {DateChangedAudit|IdChangedAudit} AuditFieldRecord
 */
/**
 * @typedef Changes
 * @property {AuditFieldRecord[]} added
 * @property {AuditFieldRecord[]} removed
 * @property {AuditFieldRecord[]} edited
 */
/**
 * @typedef ChangeEvent
 * @property {User} actioningUser
 * @property {Changes} changes
 * @property {string} operation
 * @property {DateString} timestamp
 * @property {string} type
 * @property {string} rowKey
 * @property {string} subject
 */

/**
 * @typedef {ChangeEvent} Event
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
 * @param {Event} event
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

const activityLabels = {
  cdo_issued: 'CDO issue date',
  cdo_expiry: 'CDO expiry date',
  certificate_issued: 'First certificate date',
  application_fee_paid: 'Application fee paid date',
  neutering_confirmation: 'Neutering confirmed',
  microchip_verification: 'Microchip number verified',
  joined_exemption_scheme: 'Joined interim exemption scheme',
  removed_from_cdo_process: 'Removed from CDO process',
  court_id: 'Court',
  legislation_officer: 'Dog legislation officer',
  police_force_id: 'Police force'
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

  return event.changes.edited.filter(filterSameDate).map(change => {
    const changeType = 'updated'

    return {
      ...activityRowInfo,
      activityLabel: getActivityLabelFromAuditFieldRecord(changeType)(change)
    }
  })
}

const mapActivityDtoToCheckActivityRow = (event) => {
  return {
    activityLabel: getActivityLabelFromEvent(event),
    ...getDateAndTeamMemberFromEvent(event)
  }
}

module.exports = {
  filterSameDate,
  mapActivityDtoToCheckActivityRow,
  getActivityLabelFromEvent,
  mapAuditedChangeEventToCheckActivityRows,
  getActivityLabelFromAuditFieldRecord
}
