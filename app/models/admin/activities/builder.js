const { routes } = require('../../../constants/admin')
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
  return new ViewModel({
    breadcrumbs: [
      {
        label: 'Home',
        link: '/'
      },
      {
        label: 'Admin',
        link: routes.index.get
      }
    ],
    titleHtml: `You added ${activity.label}`,
    bodyContent: `${activity.label} added to the list of ${activity.activitySource} record ${activity.activityType} activities.`,
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
    breadcrumbs: [
      {
        label: 'Home',
        link: '/'
      },
      {
        label: 'Admin',
        link: routes.index.get
      }
    ],
    titleHtml: `You removed ${activity.label}`,
    bodyContent: `${activity.label} is removed from the activity list and will not be available for new applications.`,
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
