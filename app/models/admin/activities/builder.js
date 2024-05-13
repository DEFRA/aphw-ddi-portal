const { routes, breadcrumbs } = require('../../../constants/admin')
const { keys } = require('../../../constants/cdo/activity')
const ViewModel = require('../success')

/**
 *
 * @param activities
 * @return {*}
 */
const ActivityListViewModel = (activities) => {
  return {
    model: {
      dogSent: activities.dogSent,
      dogReceived: activities.dogReceived,
      ownerSent: activities.ownerSent,
      ownerReceived: activities.ownerReceived
    }
  }
}

/**
 *
 * @param activity
 * @return {*}
 */
const ActivityAddedViewModel = (activity) => {
  const activityTypeText = activity.activityType === keys.sent ? 'send' : 'receive'
  return new ViewModel({
    breadcrumbs,
    titleHtml: `You added ${activity.label}`,
    bodyContent: [`${activity.label} is available in the ${activity.activitySource} record ${activityTypeText} activities.`],
    bottomLink: {
      link: routes.activities.index.get,
      label: 'Manage activity lists'
    }
  })
}

/**
 *
 * @param activity
 * @return {*}
 */
const ActivityRemovedViewModel = (activity) => {
  return new ViewModel({
    breadcrumbs,
    titleHtml: `You removed ${activity.label}`,
    bodyContent: [
      `${activity.label} is removed from the activity list.`,
      'Existing records are unchanged.'
    ],
    bottomLink: {
      link: routes.activities.index.get,
      label: 'Manage activity lists'
    }
  })
}

module.exports = {
  ActivityListViewModel,
  ActivityAddedViewModel,
  ActivityRemovedViewModel
}
