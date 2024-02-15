const { formatToGds } = require('../../lib/date-helpers')

const activityMapper = {
  received: {
    'Police correspondence': 'Police correspondence received',
    'Witness statement request': 'Witness statement request received',
    'Judicial review notice': 'Judicial review notice received'
  },
  sent: {
    'Change of address form': 'Change of address form sent',
    'Death of dog form': 'Death of dog form sent',
    'Witness statement': 'Witness statement sent'
  }
}

const getActivityLabelFromEvent = (event) => {
  if (event.type !== 'uk.gov.defra.ddi.event.activity') {
    return 'NOT YET DEFINED'
  }
  const activityLabel = activityMapper[event.activity?.activityType]?.[event.activity.activityLabel]

  if (activityLabel) {
    return activityLabel
  }

  if (event.activity?.activityType) {
    return `${event.activity?.activityLabel} ${event.activity?.activityType}`
  }
  return 'NOT YET DEFINED'
}

const mapActivityDtoToCheckActivityRow = (activity) => {
  return {
    activityLabel: getActivityLabelFromEvent(activity),
    date: formatToGds(activity.timestamp),
    teamMember: activity.actioningUser.displayname
  }
}

module.exports = {
  mapActivityDtoToCheckActivityRow,
  getActivityLabelFromEvent
}
