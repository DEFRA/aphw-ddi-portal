const constants = {
  routes: {
    index: {
      get: '/admin/index'
    },
    courts: {
      get: '/admin/courts',
      post: '/admin/courts'
    },
    addCourt: {
      get: '/admin/courts/add',
      post: '/admin/courts/add'
    },
    removeCourt: {
      get: '/admin/courts/remove',
      post: '/admin/courts/remove'
    },
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
    regularJobs: 'admin/regular-jobs',
    pseudonyms: 'admin/pseudonyms',
    processComments: 'admin/process-comments',
    courts: 'admin/courts',
    addOrRemove: 'common/addOrRemove'
  },
  keys: {
  }
}

module.exports = constants
