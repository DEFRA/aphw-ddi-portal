const constants = {
  routes: {
    home: {
      get: '/'
    },
    ownerDetails: {
      get: '/cdo/create/owner-details',
      post: '/cdo/create/owner-details'
    },
    selectOwner: {
      get: '/cdo/create/owner-details',
      post: '/cdo/create/owner-details'
    },
    owner: {
      get: '/cdo/create/owner-details',
      post: '/cdo/create/owner-details'
    },
    selectAddress: {
      get: '/cdo/create/select-address',
      post: '/cdo/create/select-address'
    },
    country: {
      get: '/cdo/create/country',
      post: '/cdo/create/country'
    },
    address: {
      get: '/cdo/create/address',
      post: '/cdo/create/address'
    },
    enforcementDetails: {
      get: '/cdo/create/enforcement-details',
      post: '/cdo/create/enforcement-details'
    },
    fullSummary: {
      get: '/cdo/create/full-summary',
      post: '/cdo/create/full-summary'
    },
    editDetails: {
      get: '/cdo/edit/owner-details',
      post: '/cdo/edit/owner-details'
    },
    viewOwnerDetails: {
      get: '/cdo/view/owner-details',
      post: '/cdo/view/owner-details'
    },
    postcodeLookup: {
      get: '/cdo/edit/postcode-lookup',
      post: '/cdo/edit/postcode-lookup'
    },
    selectAddressFromEdit: {
      get: '/cdo/edit/select-address',
      post: '/cdo/edit/select-address'
    },
    editAddress: {
      get: '/cdo/edit/address',
      post: '/cdo/edit/address'
    }
  },
  views: {
    home: '/',
    ownerDetails: 'cdo/create/owner-details',
    selectAddress: 'cdo/create/select-address',
    address: 'cdo/create/address',
    country: 'cdo/create/country',
    enforcementDetails: 'cdo/create/enforcement-details',
    fullSummary: 'cdo/create/confirm-all-details',
    editDetails: 'cdo/edit/owner-details',
    viewOwnerDetails: 'cdo/view/owner-details',
    postcodeLookup: 'cdo/edit/postcode-lookup',
    selectAddressFromEdit: 'cdo/edit/select-address'
  },
  keys: {
    entry: 'owner',
    ownerDetails: 'ownerDetails',
    address: 'address',
    enforcementDetails: 'enforcementDetails',
    postcodeLookup: 'postcodeLookup'
  }
}

module.exports = constants
