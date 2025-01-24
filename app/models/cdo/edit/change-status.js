const { forms } = require('../../../constants/forms')
const { errorPusherDefault } = require('../../../lib/error-helpers')
const { getNewStatusLabel } = require('../../../lib/status-helper')

function ViewModel (dog, backNav, errors) {
  this.model = {
    backLink: backNav.backLink,
    cancelLink: backNav.backLink + '&action=cancel',
    srcHashParam: backNav.srcHashParam,
    indexNumber: dog.indexNumber,
    status: getNewStatusLabel(dog),
    newStatus: {
      label: {
        text: 'Status',
        classes: 'govuk-!-font-weight-bold defra-responsive-!-font-size-16'
      },
      id: 'newStatus',
      name: 'newStatus',
      items: [
        {
          value: 'Interim exempt',
          text: 'Interim exempt'
        },
        {
          value: 'Pre-exempt',
          text: 'Applying for exemption'
        },
        {
          value: 'Failed',
          text: 'Failed to exempt dog'
        },
        {
          value: 'Exempt',
          text: 'Exempt'
        },
        {
          value: 'In breach',
          text: 'In breach'
        },
        {
          value: 'Inactive',
          text: 'Inactive'
        }
      ],
      autocomplete: forms.preventAutocomplete,
      classes: 'defra-responsive-!-font-size-16'
    },
    errors: []
  }

  if (this.model.status) {
    const ind = this.model.newStatus.items.map(x => x.value).indexOf(dog.status)
    if (ind > -1) {
      this.model.newStatus.items.splice(ind, 1)
    }
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
