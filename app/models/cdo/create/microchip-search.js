const { routes: ownerRoutes } = require('../../../constants/cdo/owner')
const { errorPusherDefault } = require('../../../lib/error-helpers')

function ViewModel (details, errors) {
  this.model = {
    backLink: ownerRoutes.ownerDetails.get,
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
