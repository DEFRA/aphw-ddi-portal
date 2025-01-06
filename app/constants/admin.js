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

const policeUserLinks = {
  index: {
    get: '/admin/users/police',
    post: '/admin/users/police'
  },
  add: {
    get: '/admin/users/police/add',
    post: '/admin/users/police/add'
  },
  addList: {
    get: '/admin/users/police/add/list',
    post: '/admin/users/police/add/list'
  },
  addConfirm: {
    get: '/admin/users/police/add/confirm',
    post: '/admin/users/police/add/confirm'
  },
  addUpdate: {
    get: '/admin/users/police/add/update',
    post: '/admin/users/police/add/update'
  },
  addRemove: {
    get: '/admin/users/police/add/remove',
    post: '/admin/users/police/add/remove'
  },
  remove: {
    get: '/admin/users/police/remove',
    post: '/admin/users/police/remove'
  },
  list: {
    get: '/admin/users/police/list'
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
    policeUsers: policeUserLinks.index,
    addPoliceUser: policeUserLinks.add,
    addRemovePoliceUser: policeUserLinks.addRemove,
    addUpdatePoliceUser: policeUserLinks.addUpdate,
    listPoliceUsersToAdd: policeUserLinks.addList,
    confirmPoliceUsersToAdd: policeUserLinks.addConfirm,
    removePoliceUser: policeUserLinks.remove,
    policeUserList: policeUserLinks.list,
    deleteOwners: {
      get: '/admin/delete/owners',
      post: '/admin/delete/owners'
    },
    deleteOwnersConfirm: {
      get: '/admin/delete/owners-confirm',
      post: '/admin/delete/owners-confirm'
    },
    deleteDogs1: {
      get: '/admin/delete/dogs-1',
      post: '/admin/delete/dogs-1'
    },
    deleteDogs2: {
      get: '/admin/delete/dogs-2',
      post: '/admin/delete/dogs-2'
    },
    deleteDogsConfirm: {
      get: '/admin/delete/dogs-confirm',
      post: '/admin/delete/dogs-confirm'
    },
    regularJobs: {
      get: '/admin/regular-jobs'
    },
    statistics: {
      get: '/admin/statistics'
    },
    externalEvents: {
      get: '/admin/external-events'
    },
    pseudonyms: {
      get: '/admin/pseudonyms',
      post: '/admin/pseudonyms'
    },
    insurance: {
      get: '/admin/insurance',
      post: '/admin/insurance'
    },
    auditQueryType: {
      get: '/admin/audit/audit-query-type',
      post: '/admin/audit/audit-query-type'
    },
    auditQueryDetails: {
      get: '/admin/audit/audit-query-details',
      post: '/admin/audit/audit-query-details'
    },
    uploadAttachments: {
      get: '/admin/attachments/upload',
      post: '/admin/attachments/upload'
    },
    listAttachments: {
      get: '/admin/attachments/list',
      post: '/admin/attachments/list'
    },
    testAttachment: {
      get: '/admin/attachments/test',
      post: '/admin/attachments/test'
    }
  },
  views: {
    index: 'admin/index',
    activities: 'admin/activities',
    regularJobs: 'admin/regular-jobs',
    statistics: 'admin/statistics',
    pseudonyms: 'admin/pseudonyms',
    insurance: 'admin/insurance',
    confirm: 'common/confirm',
    courts: 'admin/courts',
    addOrRemove: 'common/add-or-remove',
    addAdminRecord: 'common/add-admin-record',
    removeAdminRecord: 'common/remove-admin-record',
    success: 'admin/success',
    deleteDogs1: 'admin/delete/dogs-1',
    deleteDogs2: 'admin/delete/dogs-2',
    deleteDogsConfirm: 'admin/delete/dogs-confirm',
    deleteOwners: 'admin/delete/owners',
    deleteOwnersConfirm: 'admin/delete/owners-confirm',
    documentation: 'swagger',
    addPoliceUserList: 'admin/users/add/list',
    addPoliceUserConfirm: 'admin/users/add/confirm',
    userList: 'admin/users/police/list',
    auditQueryType: 'admin/audit/audit-query-type',
    auditQueryDetails: 'admin/audit/audit-query-details',
    uploadAttachments: 'admin/attachments/upload',
    listAttachments: 'admin/attachments/list',
    testAttachment: 'admin/attachments/testing'
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
      links: courtLinks
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
    },
    policeUserConstants: {
      inputField: 'policeUser',
      single: 'police officer',
      plural: 'police officers',
      buttonText: 'police officer',
      messageLabel: 'police officers',
      messageLabelCapital: 'police officers',
      errorText: 'police officer\'s email address',
      links: policeUserLinks
    }
  },
  keys: {
    oldDogs: 'oldDogs',
    orphanedOwners: 'orphanedOwners',
    policeUsers: 'policeUsers',
    fromDate: 'fromDate',
    toDate: 'toDate',
    auditQuery: 'auditQuery',
    attachmentFile: 'attachmentFile',
    attachmentTestData: 'attachmentTestData'
  },
  documentation: {
    allowedEnvironments: ['dev', 'snd', 'local']
  },
  auditQueryTypes: [
    {
      text: 'Everything',
      value: 'date',
      hint: {
        text: 'All audit events for all external users'
      }
    },
    {
      text: 'Search terms used',
      value: 'search',
      hint: {
        text: 'View all audit search events for a specific search term or terms'
      }
    },
    {
      text: 'Username',
      value: 'user',
      hint: {
        text: 'View audit event history for a specific external user'
      }
    },
    {
      text: 'Dog',
      value: 'dog',
      hint: {
        text: 'View audit events for a specific dog record'
      }
    },
    {
      text: 'Owner',
      value: 'owner',
      hint: {
        text: 'View audit events for a specific owner record'
      }
    },
    {
      text: 'Logins',
      value: 'login',
      hint: {
        text: 'When users logged in, including the operating system and browser used'
      }
    }
  ]
}

module.exports = constants
