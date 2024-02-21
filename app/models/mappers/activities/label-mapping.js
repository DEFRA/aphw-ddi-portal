const { ACTIVITY_LABELS } = require('./constants')

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

module.exports = {
  getActivityLabelFromEvent,
  getActivityLabelFromAuditFieldRecord,
  getActivityLabelFromCreatedDog
}
