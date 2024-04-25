const constants = {
  routes: {
    created: {
      get: '/cdo/create/record-created'
    },
    manage: {
      get: '/cdo/manage'
    }
  },
  views: {
    created: 'cdo/create/record-created',
    manage: 'cdo/manage/live'
  },
  keys: {
    createdCdo: 'createdCdo'
  }
}

module.exports = constants
