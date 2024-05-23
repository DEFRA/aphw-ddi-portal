const { applicationTypeElements } = require('../common/components/application-type')
const { errorPusherWithDate } = require('../../../lib/error-helpers')

function ViewModel (dogDetails, backLink, errors) {
  this.model = {
    backLink,
    dogId: dogDetails.dogId,
    ...applicationTypeElements(dogDetails),
    errors: []
  }

  errorPusherWithDate(errors, this.model)
}

module.exports = ViewModel
