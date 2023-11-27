const constants = {
  routes: {
    home: {
      get: '/'
    },
    ownerDetails: {
      get: '/register/owner/owner-details',
      post: '/register/owner/owner-details'
    },
    selectAddress: {
      get: '/register/owner/select-address',
      post: '/register/owner/select-address'
    },
    address: {
      get: '/register/owner/address',
      post: '/register/owner/address'
    },
    phoneNumber: {
      get: '/register/owner/phone-number',
      post: '/register/owner/phone-number'
    },
    email: {
      get: '/register/owner/email',
      post: '/register/owner/email'
    },
    summary: {
      get: '/register/owner/summary',
      post: '/register/owner/summary'
    },
    confirmation: {
      get: '/register/owner/confirmation'
    }
  },
  views: {
    home: '/',
    ownerDetails: 'register/owner/owner-details',
    selectAddress: 'register/owner/select-address',
    address: 'register/owner/address',
    phoneNumber: 'register/owner/phone-number',
    email: 'register/owner/email',
    summary: 'register/owner/summary',
    confirmation: 'register/owner/confirmation'
  },
  keys: {
    entry: 'owner',
    name: 'name',
    ownerDetails: 'ownerDetails',
    dateOfBirth: 'dateOfBirth',
    phoneNumber: 'phoneNumber',
    address: 'address',
    email: 'email'
  }
}

module.exports = constants
