const constants = {
  routes: {
    ownerDetails: {
      get: '/register/owner/owner-details',
      post: '/register/owner/owner-details'
    },
    name: {
      get: '/register/owner/name',
      post: '/register/owner/name'
    },
    postcode: {
      get: '/register/owner/postcode',
      post: '/register/owner/postcode'
    },
    selectAddress: {
      get: '/register/owner/select-address',
      post: '/register/owner/select-address'
    },
    address: {
      get: '/register/owner/address',
      post: '/register/owner/address'
    },
    dateOfBirth: {
      get: '/register/owner/date-of-birth',
      post: '/register/owner/date-of-birth'
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
    name: 'register/owner/name',
    ownerDetails: 'register/owner/owner-details',
    postcode: 'register/owner/postcode',
    selectAddress: 'register/owner/select-address',
    address: 'register/owner/address',
    dateOfBirth: 'register/owner/date-of-birth',
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
