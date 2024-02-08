const constants = {
  routes: {
    details: {
      get: '/cdo/create/dog-details',
      post: '/cdo/create/dog-details'
    },
    confirm: {
      get: '/cdo/create/confirm-dog-details',
      post: '/cdo/create/confirm-dog-details'
    },
    viewDogDetails: {
      get: '/cdo/view/dog-details',
      post: '/cdo/view/dog-details'
    },
    editDogDetails: {
      get: '/cdo/edit/dog-details',
      post: '/cdo/edit/dog-details'
    },
    editExemptionDetails: {
      get: '/cdo/edit/exemption-details',
      post: '/cdo/edit/exemption-details'
    },
    changeStatus: {
      get: '/cdo/edit/change-status',
      post: '/cdo/edit/change-status'
    },
    changeStatusConfirmation: {
      get: '/cdo/edit/change-status-confirmation'
    },
    delete: {
      get: '/cdo/create/confirm-dog-delete',
      post: '/cdo/create/confirm-dog-delete'
    },
    certificate: {
      get: '/cdo/view/certificate',
      post: '/cdo/view/certificate'
    },
    addActivity: {
      get: '/cdo/edit/add-activity',
      post: '/cdo/edit/add-activity'
    },
    selectActivity: {
      get: '/cdo/edit/select-activity',
      post: '/cdo/edit/select-activity'
    },
    selectActivityConfirmation: {
      get: '/cdo/edit/select-activity-confirmation',
      post: '/cdo/edit/select-activity-confirmation'
    }
  },
  views: {
    editDogDetails: 'cdo/edit/dog-details',
    viewDogDetails: 'cdo/view/dog-details',
    editExemptionDetails: 'cdo/edit/exemption-details',
    changeStatus: 'cdo/edit/change-status',
    changeStatusConfirmation: 'cdo/edit/change-status-confirmation',
    details: 'cdo/create/dog-details',
    confirm: 'cdo/create/confirm-dog-details',
    delete: 'cdo/create/confirm-dog-delete',
    certificate: 'cdo/view/certificate',
    addActivity: 'cdo/edit/add-activity',
    selectActivity: 'cdo/edit/select-activity',
    selectActivityConfirmation: 'cdo/edit/select-activity-confirmation'
  },
  keys: {
    entry: 'dogs',
    breed: 'breed',
    name: 'name',
    cdoIssued: 'cdoIssued',
    cdoExpiry: 'cdoExpiry',
    dateOfBirth: 'dateOfBirth',
    dateOfDeath: 'dateOfDeath',
    dateExported: 'dateExported',
    dateStolen: 'dateStolen',
    dateUntraceable: 'dateUntraceable'
  }
}

module.exports = constants
