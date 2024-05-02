const constants = {
  routes: {
    index: {
      get: '/admin/index'
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
  },
  keys: {
  }
}

module.exports = constants
