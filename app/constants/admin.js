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
    }
  },
  views: {
    index: 'admin/index',
    confirm: 'common/confirm',
    regularJobs: 'admin/regular-jobs',
    pseudonyms: 'admin/pseudonyms',
    processComments: 'admin/process-comments',
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
