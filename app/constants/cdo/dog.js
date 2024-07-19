const constants = {
  routes: {
    details: {
      get: '/cdo/create/dog-details',
      post: '/cdo/create/dog-details'
    },
    selectExistingDog: {
      get: '/cdo/create/select-existing-dog',
      post: '/cdo/create/select-existing-dog'
    },
    microchipSearch: {
      get: '/cdo/create/microchip-search',
      post: '/cdo/create/microchip-search'
    },
    microchipResults: {
      get: '/cdo/create/microchip-results',
      post: '/cdo/create/microchip-results'
    },
    microchipResultsStop: {
      get: '/cdo/create/microchip-results-stop'
    },
    applicationType: {
      get: '/cdo/create/application-type',
      post: '/cdo/create/application-type'
    },
    confirm: {
      get: '/cdo/create/confirm-dog-details',
      post: '/cdo/create/confirm-dog-details'
    },
    deleteDog: {
      get: '/cdo/delete/dog',
      post: '/cdo/delete/dog'
    },
    viewDogDetails: {
      get: '/cdo/view/dog-details',
      post: '/cdo/view/dog-details'
    },
    editDogDetails: {
      get: '/cdo/edit/dog-details',
      post: '/cdo/edit/dog-details'
    },
    viewActivities: {
      get: '/cdo/view/activity'
    },
    editExemptionDetails: {
      get: '/cdo/edit/exemption-details',
      post: '/cdo/edit/exemption-details'
    },
    changeStatus: {
      get: '/cdo/edit/change-status',
      post: '/cdo/edit/change-status'
    },
    inBreach: {
      get: '/cdo/edit/change-status/in-breach',
      post: '/cdo/edit/change-status/in-breach'
    },
    changeStatusConfirmation: {
      get: '/cdo/edit/change-status-confirmation'
    },
    delete: {
      get: '/cdo/create/confirm-dog-delete',
      post: '/cdo/create/confirm-dog-delete'
    },
    certificate: {
      get: '/cdo/view/certificate',
      post: '/cdo/view/certificate'
    },
    addActivity: {
      get: '/cdo/edit/add-activity',
      post: '/cdo/edit/add-activity'
    },
    selectActivity: {
      get: '/cdo/edit/select-activity',
      post: '/cdo/edit/select-activity'
    },
    activityConfirmation: {
      get: '/cdo/edit/activity-confirmation'
    },
    deleteGeneric: {
      get: '/cdo/delete/dog',
      post: '/cdo/delete/dog'
    }
  },
  views: {
    editDogDetails: 'cdo/edit/dog-details',
    microchipSearch: 'cdo/create/microchip-search',
    microchipResults: 'cdo/create/microchip-results',
    microchipResultsStop: 'cdo/create/microchip-results-stop',
    viewDogDetails: 'cdo/view/dog-details',
    viewDogActivities: 'cdo/view/check-activities',
    editExemptionDetails: 'cdo/edit/exemption-details',
    changeStatus: 'cdo/edit/change-status',
    inBreachCategories: 'cdo/edit/in-breach',
    changeStatusConfirmation: 'cdo/edit/change-status-confirmation',
    applicationType: 'cdo/create/application-type',
    details: 'cdo/create/dog-details',
    selectExistingDog: 'cdo/create/select-existing-dog',
    confirm: 'cdo/create/confirm-dog-details',
    delete: 'cdo/create/confirm-dog-delete',
    certificate: 'cdo/view/certificate',
    addActivity: 'cdo/edit/add-activity',
    selectActivity: 'cdo/edit/select-activity',
    activityConfirmation: 'cdo/edit/activity-confirmation',
    confirmDeleteGeneric: 'common/confirm',
    confirmation: 'common/deleted/dog',
    confirmDogAndOwner: 'cdo/delete/confirmDogAndOwner',
    deleteGeneric: 'common/deleted/dog',
    deleteDogAndOwner: 'common/deleted/dogAndOwner'
  },
  keys: {
    entry: 'dogs',
    breed: 'breed',
    name: 'name',
    microchipSearch: 'microchipSearch',
    microchipNumber: 'microchipNumber',
    microchipNumber2: 'microchipNumber2',
    applicationType: 'applicationType',
    interimExemption: 'interimExemption',
    indexNumber: 'indexNumber',
    cdoIssued: 'cdoIssued',
    cdoExpiry: 'cdoExpiry',
    dateOfBirth: 'dateOfBirth',
    dateOfDeath: 'dateOfDeath',
    dateExported: 'dateExported',
    dateStolen: 'dateStolen',
    dateUntraceable: 'dateUntraceable',
    existingDogs: 'existingDogs'
  }
}

module.exports = constants
