const { formatToGds } = require('../../../lib/date-helpers')
const { cleanUserDisplayName } = require('../../../lib/model-helpers')
const { ADDED_EVENTS } = require('./constants')
const { getActivityLabelFromEvent, getActivityLabelFromCreatedDog, getActivityLabelFromAuditFieldRecord } = require('./label-mapping')

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
    let changeType = ADDED_EVENTS.includes(changeRecord[0]) ? 'added' : 'updated'

    if (changeRecord[0] === 'status') {
      const [,, statusName] = changeRecord
      changeType = statusName
    }
    const activityLabel = getActivityLabelFromAuditFieldRecord(changeType)(changeRecord)

    if (filterNonUpdatedFields(changeRecord) && activityLabel !== 'N/A') {
      const activityRow = { ...activityRowInfo, activityLabel }
      return [...activityRows, activityRow]
    }

    return [...activityRows]
  }, activityRows)
}

/**
 * @param {ActivityEvent} event
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

  return event.created.dogs.map(createdDogEvent => {
    return {
      activityLabel: getActivityLabelFromCreatedDog(createdDogEvent),
      ...dateAndTeamMemberData
    }
  })
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

    return [...activityRows, ...addedRows]
  }, activityRowsAccumulator)
}

module.exports = {
  filterNonUpdatedFields,
  mapActivityDtoToCheckActivityRow,
  mapAuditedChangeEventToCheckActivityRows,
  flatMapActivityDtoToCheckActivityRow,
  getActivityLabelFromCreatedDog,
  mapCreatedEventToCheckActivityRows
}
