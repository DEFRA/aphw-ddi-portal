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

const constants = {
  routes: {
    index: {
      get: '/admin/index'
    },
    courts: courtBackLinks.index,
    addCourt: courtBackLinks.add,
    removeCourt: courtBackLinks.remove,
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
    pseudonyms: 'admin/pseudonyms'
    confirm: 'common/confirm',
    courts: 'admin/courts',
    addOrRemove: 'common/add-or-remove',
    addAdminRecord: 'common/add-admin-record',
    success: 'admin/success'
  },
  addRemove: {
    courtConstants: {
      inputField: 'court',
      messageLabel: 'court name',
      messageLabelCapital: 'Court name',
      backLinks: courtBackLinks
    }
  }
}

module.exports = constants
