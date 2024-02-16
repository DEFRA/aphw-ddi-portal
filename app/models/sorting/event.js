const sortEventsDescCompareFn = (a, b) => {
  const sortValueA = a.activity?.activityDate ? a.activity.activityDate : a.timestamp
  const sortValueB = b.activity?.activityDate ? b.activity.activityDate : b.timestamp

  return `${sortValueB}${b.timestamp}`.localeCompare(`${sortValueA}${a.timestamp}`)
}

const sortEventsDesc = (events) => {
  const eventsToSort = [...events]
  return eventsToSort.sort(sortEventsDescCompareFn)
}

module.exports = {
  sortEventsDescCompareFn,
  sortEventsDesc
}
