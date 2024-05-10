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

const policeLinks = {
  index: {
    get: '/admin/police',
    post: '/admin/police'
  },
  add: {
    get: '/admin/police/add',
    post: '/admin/police/add'
  },
  remove: {
    get: '/admin/police/remove',
    post: '/admin/police/remove'
  }
}

const adminIndex = {
  get: '/admin/index'
}

const constants = {
  routes: {
    index: adminIndex,
    activities: activityLinks,
    courts: courtLinks.index,
    addCourt: courtLinks.add,
    removeCourt: courtLinks.remove,
    police: policeLinks.index,
    addPoliceForce: policeLinks.add,
    removePoliceForce: policeLinks.remove,
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
      links: activityLinks
    },
    policeConstants: {
      inputField: 'police',
      messageLabel: 'police force',
      messageLabelCapital: 'Police force',
      links: policeLinks
    }
  }
}

module.exports = constants
