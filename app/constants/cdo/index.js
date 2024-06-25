const constants = {
  routes: {
    created: {
      get: '/cdo/create/record-created'
    },
    manage: {
      get: '/cdo/manage'
    },
    manageCdo: {
      get: '/cdo/manage/cdo'
    },
    manageCdoTaskBase: {
      get: '/cdo/manage/task'
    },
    manageExpired: {
      get: '/cdo/manage/expired'
    },
    manageDue: {
      get: '/cdo/manage/due'
    },
    manageInterim: {
      get: '/cdo/manage/interim'
    }
  },
  tasks: {
    sendApplicationPack: 'send-application-pack',
    recordInsuranceDetails: 'record-insurance-details',
    recordMicrochipNumber: 'record-microchip-number',
    recordApplicationFeePayment: 'record-application-fee-payment',
    sendForm2: 'send-form2',
    recordVerificationDates: 'record-verification-dates'
  },
  views: {
    created: 'cdo/create/record-created',
    manage: 'cdo/manage/live',
    manageCdo: 'cdo/manage/cdo',
    taskViews: 'cdo/manage/tasks'
  },
  keys: {
    createdCdo: 'createdCdo'
  }
}

module.exports = constants
