/**
 * @typedef Activity
 * @property {string} activityDate
 **/
/**
  * @typedef EventToSort
  * @property {string} timestamp
  * @property {'uk.gov.defra.ddi.event.update'|'uk.gov.defra.ddi.event.create'|'uk.gov.defra.ddi.event.activity'} type
  * @property {Activity} [activity]
 **/

const getUnixDate = (dateString) => {
  return new Date(dateString).getTime()
}

/**
 *
 * @param {EventToSort} a
 * @param {EventToSort} b
 */
const sortEventsDescCompareFn = (a, b) => {
  const primarySortValueA = a.activity?.activityDate ? a.activity.activityDate : a.timestamp
  const primarySortValueB = b.activity?.activityDate ? b.activity.activityDate : b.timestamp
  const primarySortA = getUnixDate(primarySortValueA)
  const primarySortB = getUnixDate(primarySortValueB)
  const secondarySortA = getUnixDate(a.timestamp)
  const secondarySortB = getUnixDate(b.timestamp)

  if (primarySortA !== primarySortB) {
    return primarySortB - primarySortA
  }

  return secondarySortB - secondarySortA
}

const sortEventsDesc = (events) => {
  const eventsToSort = [...events]
  return eventsToSort.sort(sortEventsDescCompareFn)
}

module.exports = {
  sortEventsDescCompareFn,
  sortEventsDesc
}
