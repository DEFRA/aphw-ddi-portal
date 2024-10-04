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
  remove: {
    get: '/admin/users/police/remove',
    post: '/admin/users/police/remove'
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
    removePoliceUser: policeUserLinks.remove,
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
    pseudonyms: {
      get: '/admin/pseudonyms',
      post: '/admin/pseudonyms'
    },
    insurance: {
      get: '/admin/insurance',
      post: '/admin/insurance'
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
    documentation: 'swagger'
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
      messageLabel: 'police officers',
      messageLabelCapital: 'police officers',
      links: policeUserLinks
    }
  },
  keys: {
    oldDogs: 'oldDogs',
    orphanedOwners: 'orphanedOwners'
  },
  documentation: {
    allowedEnvironments: ['dev', 'snd', 'local']
  }
}

module.exports = constants
