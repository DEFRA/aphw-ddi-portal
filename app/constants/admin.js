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
      get: '/admin/pseudonyms'
    }
  },
  views: {
    index: 'admin/index',
    regularJobs: 'admin/regular-jobs',
    pseudonyms: 'admin/pseudonyms',
    processComments: 'admin/process-comments'
  },
  keys: {
  }
}

module.exports = constants
