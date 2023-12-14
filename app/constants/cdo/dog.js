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
    }
  },
  views: {
    viewDogDetails: 'cdo/view/dog-details',
    details: 'cdo/create/dog-details',
    confirm: 'cdo/create/confirm-dog-details'
  },
  keys: {
    entry: 'dogs',
    breed: 'breed',
    name: 'name',
    cdoIssued: 'cdoIssued',
    cdoExpiry: 'cdoExpiry'
  }
}

module.exports = constants
