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
    delete: {
      get: '/cdo/create/confirm-dog-delete',
      post: '/cdo/create/confirm-dog-delete'
    },
    certificate: {
      get: '/cdo/view/certificate',
      post: '/cdo/view/certificate'
    }
  },
  views: {
    editDogDetails: 'cdo/edit/dog-details',
    viewDogDetails: 'cdo/view/dog-details',
    editExemptionDetails: 'cdo/edit/exemption-details',
    details: 'cdo/create/dog-details',
    confirm: 'cdo/create/confirm-dog-details',
    delete: 'cdo/create/confirm-dog-delete',
    certificate: 'cdo/view/certificate'
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
    dateStolen: 'dateStolen'
  }
}

module.exports = constants
