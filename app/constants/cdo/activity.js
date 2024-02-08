const constants = {
  routes: {
    addActivity: {
      get: '/cdo/edit/add-activity',
      post: '/cdo/edit/add-activity'
    },
    selectActivity: {
      get: '/cdo/edit/select-activity',
      post: '/cdo/edit/select-activity'
    },
    selectActivityConfirmation: {
      get: '/cdo/edit/select-activity-confirmation',
      post: '/cdo/edit/select-activity-confirmation'
    }
  },
  views: {
    addActivity: 'cdo/edit/add-activity',
    selectActivity: 'cdo/edit/select-activity',
    selectActivityConfirmation: 'cdo/edit/select-activity-confirmation'
  },
  keys: {
    activity: 'activity',
    activityDate: 'activityDate'
  }
}

module.exports = constants
