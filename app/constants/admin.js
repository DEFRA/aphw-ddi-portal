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

const deleteDogsLinks1 = {
  dogs: {
    get: '/admin/delete/dogs-1',
    post: '/admin/delete/dogs-1'
  }
}

const deleteDogsLinks2 = {
  dogs: {
    get: '/admin/delete/dogs-2',
    post: '/admin/delete/dogs-2'
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
    deleteDogs1: deleteDogsLinks1.dogs,
    deleteDogs2: deleteDogsLinks2.dogs,
    regularJobs: {
      get: '/admin/regular-jobs'
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
    pseudonyms: 'admin/pseudonyms',
    insurance: 'admin/insurance',
    confirm: 'common/confirm',
    courts: 'admin/courts',
    addOrRemove: 'common/add-or-remove',
    addAdminRecord: 'common/add-admin-record',
    removeAdminRecord: 'common/remove-admin-record',
    success: 'admin/success',
    deleteDogs: 'admin/delete/dogs'
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
    }
  }
}

module.exports = constants
