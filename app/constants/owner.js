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
    summary: {
      get: '/cdo/create/summary',
      post: '/cdo/create/summary'
    },
    confirmation: {
      get: '/cdo/create/confirmation'
    }
  },
  views: {
    home: '/',
    ownerDetails: 'cdo/create/owner-details',
    selectAddress: 'cdo/create/select-address',
    address: 'cdo/create/address',
    summary: 'cdo/create/summary',
    confirmation: 'cdo/create/confirmation'
  },
  keys: {
    entry: 'owner',
    ownerDetails: 'ownerDetails',
    address: 'address'
  }
}

module.exports = constants
