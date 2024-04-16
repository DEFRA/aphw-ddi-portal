const { errorPusherDefault } = require('../../../lib/error-helpers')

function ViewModel (details, backNav, errors) {
  this.model = {
    backLink: backNav.backLink,
    confirm: {
      id: 'confirm',
      name: 'confirm',
      classes: 'govuk-!-font-size-16',
      // value: question.confirm,
      items: [
        {
          text: 'Yes',
          value: 'Y'
        },
        {
          text: 'No',
          value: 'N'
        }
      ]
    },
    confirmText: `Are you sure you want to ${details.action} ${details.recordTypeText} record ${details.nameOrReference}?`,
    recordType: details.recordType,
    pk: details.pk,
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
