const { routes } = require('../../../constants/cdo/dog')
const { applicationTypeElements } = require('../common/components/application-type')
const { errorPusherWithDate } = require('../../../lib/error-helpers')

function ViewModel (dogDetails, errors) {
  this.model = {
    backLink: routes.selectExistingDog.get,
    dogId: dogDetails.dogId,
    ...applicationTypeElements(dogDetails),
    errors: []
  }

  errorPusherWithDate(errors, this.model)
}

module.exports = ViewModel
