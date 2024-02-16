const { formatToGds } = require('../../lib/date-helpers')

const getActivityLabelFromEvent = (event) => {
  if (event.type !== 'uk.gov.defra.ddi.event.activity') {
    return 'NOT YET DEFINED'
  }

  if (event.activity?.activityType) {
    return `${event.activity?.activityLabel} ${event.activity?.activityType}`
  }
  return 'NOT YET DEFINED'
}

const mapActivityDtoToCheckActivityRow = (event) => {
  const date = event.activity?.activityDate || event.timestamp

  return {
    activityLabel: getActivityLabelFromEvent(event),
    date: formatToGds(date),
    teamMember: event.actioningUser.displayname
  }
}

module.exports = {
  mapActivityDtoToCheckActivityRow,
  getActivityLabelFromEvent
}
