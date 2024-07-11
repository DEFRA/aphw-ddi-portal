const constants = {
  routes: {
    created: {
      get: '/cdo/create/record-created'
    },
    manage: {
      get: '/cdo/manage'
    },
    manageCdo: {
      get: '/cdo/manage/cdo',
      post: '/cdo/manage/cdo'
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
    applicationPackSent: 'applicationPackSent',
    insuranceDetailsRecorded: 'insuranceDetailsRecorded',
    microchipNumberRecorded: 'microchipNumberRecorded',
    applicationFeePaid: 'applicationFeePaid',
    form2Sent: 'form2Sent',
    verificationDateRecorded: 'verificationDateRecorded',
    certificateIssued: 'certificateIssued'
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
