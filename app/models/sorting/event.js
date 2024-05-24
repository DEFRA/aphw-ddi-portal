const { CHANGE_OWNER } = require('../../constants/events')

const sortEventsDescCompareFn = (a, b) => {
  const sortValueA = a.activity?.activityDate ? a.activity.activityDate : a.timestamp
  const sortValueB = b.activity?.activityDate ? b.activity.activityDate : b.timestamp

  return `${sortValueB}${b.timestamp}`.localeCompare(`${sortValueA}${a.timestamp}`)
}

const sortEventsDesc = (events) => {
  const eventsToSort = [...events]
  return eventsToSort.sort(sortEventsDescCompareFn)
}

const filterEvents = (events, entityConfig) => {
  return events.events.filter(event => event.type !== CHANGE_OWNER ||
    (entityConfig.source === 'dog' ? event.details?.startsWith(`Dog ${entityConfig.pk}`) : true))
}

module.exports = {
  sortEventsDescCompareFn,
  sortEventsDesc,
  filterEvents
}
