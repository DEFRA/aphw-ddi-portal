const courtBackLinks = {
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

const policeBackLinks = {
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
    courts: courtBackLinks.index,
    addCourt: courtBackLinks.add,
    removeCourt: courtBackLinks.remove,
    police: policeBackLinks.index,
    addPoliceForce: policeBackLinks.add,
    removePoliceForce: policeBackLinks.remove,
    regularJobs: {
      get: '/admin/regular-jobs'
    },
    processComments: {
      get: '/admin/process-comments'
    },
    pseudonyms: {
      get: '/admin/pseudonyms',
      post: '/admin/pseudonyms'
    },
    activities: {
      get: '/admin/activities'
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
      backLinks: courtBackLinks
    },
    policeConstants: {
      inputField: 'police_force',
      messageLabel: 'police force',
      messageLabelCapital: 'Police force',
      backLinks: policeBackLinks
    }
  }
}

module.exports = constants
