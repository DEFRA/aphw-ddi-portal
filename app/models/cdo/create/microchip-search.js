const { errorPusherDefault } = require('../../../lib/error-helpers')

function ViewModel (details, backNav, errors) {
  this.model = {
    backLink: backNav.backLink,
    dogId: details.dogId,
    microchipNumber: {
      id: 'microchipNumber',
      name: 'microchipNumber',
      classes: 'govuk-!-width-one-half',
      value: details.microchipNumber,
      attributes: { maxlength: '20' }
    },
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
