const { errorPusherDefault } = require('../../../lib/error-helpers')

function ViewModel (indexNumber, origin, backNav, error) {
  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    showBreadcrumbNotBackLink: origin === 'manage-cdo',
    indexNumber,
    generalError: {},
    errors: []
  }

  errorPusherDefault(error, this.model)
}

module.exports = ViewModel
