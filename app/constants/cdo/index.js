const constants = {
  routes: {
    created: {
      get: '/cdo/create/record-created'
    },
    manage: {
      get: '/cdo/manage'
    },
    manageCdo: {
      get: '/cdo/manage-cdo'
    },
    manageExpired: {
      get: '/cdo/manage/expired'
    },
    manageDue: {
      get: '/cdo/manage/due'
    },
    manageInterim: {
      get: '/cdo/manage/interim'
    }
  },
  views: {
    created: 'cdo/create/record-created',
    manage: 'cdo/manage/live',
    manageCdo: 'cdo/manage/cdo'
  },
  keys: {
    createdCdo: 'createdCdo'
  }
}

module.exports = constants
