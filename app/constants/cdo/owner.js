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
      get: '/cdo/create/select-owner',
      post: '/cdo/create/select-owner'
    },
    owner: {
      get: '/cdo/create/owner-details',
      post: '/cdo/create/owner-details'
    },
    postcodeLookupCreate: {
      get: '/cdo/create/postcode-lookup',
      post: '/cdo/create/postcode-lookup'
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
    postcodeLookupEdit: {
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
    },
    policeForceChanged: {
      get: '/cdo/edit/police-force-changed',
      post: '/cdo/edit/police-force-changed'
    },
    policeForceNotFound: {
      get: '/cdo/edit/police-force-not-found',
      post: '/cdo/edit/police-force-not-found'
    },
    countryChanged: {
      get: '/cdo/edit/country-changed',
      post: '/cdo/edit/country-changed'
    },
    countryChangedInfo: {
      get: '/cdo/edit/country-changed-info',
      post: '/cdo/edit/country-changed-info'
    },
    delete: {
      get: '/cdo/delete/owner',
      post: '/cdo/delete/owner'
    }
  },
  views: {
    home: '/',
    ownerDetails: 'cdo/create/owner-details',
    selectOwner: 'cdo/create/select-owner',
    selectAddress: 'cdo/create/select-address',
    address: 'cdo/create/address',
    country: 'cdo/create/country',
    postcodeLookupCreate: 'cdo/create/postcode-lookup',
    enforcementDetails: 'cdo/create/enforcement-details',
    fullSummary: 'cdo/create/confirm-all-details',
    editDetails: 'cdo/edit/owner-details',
    viewOwnerDetails: 'cdo/view/owner-details',
    postcodeLookupEdit: 'cdo/edit/postcode-lookup',
    selectAddressFromEdit: 'cdo/edit/select-address',
    policeForceChanged: 'cdo/edit/police-force-changed',
    policeForceNotFound: 'cdo/edit/police-force-not-found',
    countryChanged: 'cdo/edit/country-changed',
    countryChangedInfo: 'cdo/edit/country-changed-info',
    delete: 'common/confirm',
    confirmation: 'common/deleted/owner',
    documentation: 'swagger'
  },
  keys: {
    entry: 'owner',
    ownerDetails: 'ownerDetails',
    address: 'address',
    enforcementDetails: 'enforcementDetails',
    postcodeLookup: 'postcodeLookup',
    policeForceChangedResult: 'police-force-changed-result'
  }
}

module.exports = constants
