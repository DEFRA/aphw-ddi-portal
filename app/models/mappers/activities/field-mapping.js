const { ACTIVITY_LABELS } = require('./constants')
const { formatToGds } = require('../../../lib/date-helpers')
const { cleanUserDisplayName } = require('../../../lib/model-helpers')

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
 * @param {ActivityEvent} event
 * @returns {string}
 */
const getActivityLabelFromEvent = (event) => {
  if (event.activity?.activityType) {
    return `${event.activity?.activityLabel} ${event.activity?.activityType}`
  }
  return 'NOT YET DEFINED'
}

/**
 * @param {string} eventType
 * @returns {GetActivityLabelFromAuditFieldRecordFn}
 */
const getActivityLabelFromAuditFieldRecord = (eventType) => (auditFieldRecord) => {
  const [fieldValue] = auditFieldRecord

  if (ACTIVITY_LABELS[fieldValue]) {
    return `${ACTIVITY_LABELS[fieldValue]} ${eventType}`
  }
  return 'N/A'
}

/**
 * @param {CreatedDogEvent} createdDogEvent
 * @returns {string}
 */
const getActivityLabelFromCreatedDog = (createdDogEvent) => {
  const status = createdDogEvent.status?.status ? ` (${createdDogEvent.status.status})` : ''
  return `Dog record created${status}`
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
const fieldHasBeenUpdated = (auditFieldRecord) => {
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

module.exports = {
  getActivityLabelFromEvent,
  getActivityLabelFromAuditFieldRecord,
  getActivityLabelFromCreatedDog,
  getDateAndTeamMemberFromEvent,
  fieldHasBeenUpdated
}
