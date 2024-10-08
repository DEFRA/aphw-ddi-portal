const { forms } = require('../../../constants/forms')
const { errorPusherDefault } = require('../../../lib/error-helpers')

function ViewModel (dog, backNav, errors) {
  this.model = {
    backLink: backNav.backLink,
    cancelLink: backNav.backLink + '&action=cancel',
    srcHashParam: backNav.srcHashParam,
    indexNumber: dog.indexNumber,
    status: dog.status,
    newStatus: {
      label: {
        text: 'Status',
        classes: 'govuk-!-font-weight-bold govuk-!-font-size-16'
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
          text: 'Pre-exempt'
        },
        {
          value: 'Failed',
          text: 'Failed'
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
          value: 'Withdrawn',
          text: 'Withdrawn'
        },
        {
          value: 'Inactive',
          text: 'Inactive'
        }
      ],
      autocomplete: forms.preventAutocomplete,
      classes: 'govuk-!-font-size-16'
    },
    errors: []
  }

  if (this.model.status) {
    const ind = this.model.newStatus.items.map(x => x.value).indexOf(this.model.status)
    if (ind > -1) {
      this.model.newStatus.items.splice(ind, 1)
    }
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
