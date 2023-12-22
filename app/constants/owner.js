const constants = {
  routes: {
    home: {
      get: '/'
    },
    ownerDetails: {
      get: '/cdo/create/owner-details',
      post: '/cdo/create/owner-details'
    },
    selectAddress: {
      get: '/cdo/create/select-address',
      post: '/cdo/create/select-address'
    },
    address: {
      get: '/cdo/create/address',
      post: '/cdo/create/address'
    },
    enforcementDetails: {
      get: '/cdo/create/enforcement-details',
      post: '/cdo/create/enforcement-details'
    },
    ownerSummary: {
      get: '/cdo/create/owner-summary',
      post: '/cdo/create/owner-summary'
    },
    confirmation: {
      get: '/cdo/create/confirmation'
    },
    editDetails: {
      get: '/cdo/edit/owner-details',
      post: '/cdo/edit/owner-details'
    },
    viewOwnerDetails: {
      get: '/cdo/view/owner-details',
      post: '/cdo/view/owner-details'
    }
  },
  views: {
    home: '/',
    ownerDetails: 'cdo/create/owner-details',
    selectAddress: 'cdo/create/select-address',
    address: 'cdo/create/address',
    enforcementDetails: 'cdo/create/enforcement-details',
    ownerSummary: 'cdo/create/owner-summary',
    confirmation: 'cdo/create/confirmation',
    editDetails: 'cdo/edit/owner-details',
    viewOwnerDetails: 'cdo/view/owner-details'
  },
  keys: {
    entry: 'owner',
    ownerDetails: 'ownerDetails',
    address: 'address',
    enforcementDetails: 'enforcementDetails'
  }
}

module.exports = constants
