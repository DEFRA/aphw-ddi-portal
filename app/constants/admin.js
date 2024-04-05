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
    }
  },
  views: {
    index: 'admin/index',
    regularJobs: 'admin/regular-jobs',
    processComments: 'admin/process-comments'
  },
  keys: {
  }
}

module.exports = constants
