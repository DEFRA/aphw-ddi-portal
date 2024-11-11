const jobs = {
  routes: {
    purgeSoftDelete: {
      get: '/jobs/purge-soft-delete'
    },
    neuteringDeadline: {
      get: '/jobs/neutering-deadline'
    },
    expiredInsurance: {
      get: '/jobs/expired-insurance'
    }
  }
}

module.exports = jobs
