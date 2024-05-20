const { routes } = require('../../../constants/cdo/dog')
const { errorPusherDefault } = require('../../../lib/error-helpers')

function ViewModel (details, error) {
  this.model = {
    backLink: `${routes.microchipSearch.get}/${details.id ?? details.dogId}`,
    dogId: details.id ?? details.dogId,
    microchipNumber: details.microchipNumber,
    results: details.results,
    confirm: {
      id: 'confirm',
      name: 'confirm',
      classes: 'govuk-!-font-size-16',
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
    confirmText: `Do you want to make ${details.newFirstName} ${details.newLastName} the dog owner of ${details.results[0].dogName}?`,
    confirmTextClass: 'govuk-fieldset__legend--m',
    errors: []
  }

  errorPusherDefault(error, this.model)
}

module.exports = ViewModel
