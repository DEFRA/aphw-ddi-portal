const courtLinks = {
  index: {
    get: '/admin/courts',
    post: '/admin/courts'
  },
  add: {
    get: '/admin/courts/add',
    post: '/admin/courts/add'
  },
  remove: {
    get: '/admin/courts/remove',
    post: '/admin/courts/remove'
  }
}

const activityLinks = {
  index: {
    get: '/admin/activities'
  },
  add: {
    get: '/admin/activities/add',
    post: '/admin/activities/add'
  },
  remove: {
    get: '/admin/activities/remove',
    post: '/admin/activities/remove'
  }
}

const adminIndex = {
  get: '/admin/index'
}

const constants = {
  routes: {
    index: {
      get: '/admin/index'
    },
    activities: activityLinks,
    courts: courtLinks,
    addCourt: courtLinks.add,
    removeCourt: courtLinks.remove,
    regularJobs: {
      get: '/admin/regular-jobs'
    },
    processComments: {
      get: '/admin/process-comments'
    },
    pseudonyms: {
      get: '/admin/pseudonyms',
      post: '/admin/pseudonyms'
    }
  },
  views: {
    index: 'admin/index',
    activities: 'admin/activities',
    regularJobs: 'admin/regular-jobs',
    processComments: 'admin/process-comments',
    pseudonyms: 'admin/pseudonyms',
    confirm: 'common/confirm',
    courts: 'admin/courts',
    addOrRemove: 'common/add-or-remove',
    addAdminRecord: 'common/add-admin-record',
    removeAdminRecord: 'common/remove-admin-record',
    success: 'admin/success'
  },
  breadcrumbs: [
    {
      label: 'Home',
      link: '/'
    },
    {
      label: 'Admin',
      link: adminIndex.get
    }
  ],
  addRemove: {
    courtConstants: {
      inputField: 'court',
      messageLabel: 'court name',
      messageLabelCapital: 'Court name',
      backLinks: courtLinks
    },
    activityConstants: {
      inputField: 'activity',
      messageLabel: 'activity name',
      messageLabelCapital: 'Activity name',
      backLinks: activityLinks
    }
  }
}

module.exports = constants
