const constants = {
  routes: {
    regularJobs: {
      get: '/admin/regular-jobs'
    }
  },
  views: {
    regularJobs: 'admin/regular-jobs',
    viewDogDetails: 'cdo/view/dog-details',
    viewDogActivities: 'cdo/view/check-activities',
    editExemptionDetails: 'cdo/edit/exemption-details',
    changeStatus: 'cdo/edit/change-status',
    changeStatusConfirmation: 'cdo/edit/change-status-confirmation',
    details: 'cdo/create/dog-details',
    confirm: 'cdo/create/confirm-dog-details',
    delete: 'cdo/create/confirm-dog-delete',
    certificate: 'cdo/view/certificate',
    addActivity: 'cdo/edit/add-activity',
    selectActivity: 'cdo/edit/select-activity',
    activityConfirmation: 'cdo/edit/activity-confirmation'
  },
  keys: {
    entry: 'dogs',
    breed: 'breed',
    name: 'name',
    applicationType: 'applicationType',
    interimExemption: 'interimExemption',
    cdoIssued: 'cdoIssued',
    cdoExpiry: 'cdoExpiry',
    dateOfBirth: 'dateOfBirth',
    dateOfDeath: 'dateOfDeath',
    dateExported: 'dateExported',
    dateStolen: 'dateStolen',
    dateUntraceable: 'dateUntraceable'
  }
}

module.exports = constants
