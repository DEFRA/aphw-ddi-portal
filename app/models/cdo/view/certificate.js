const { errorPusherDefault } = require('../../../lib/error-helpers')

function ViewModel (indexNumber, origin, backNav, error) {
  const backLink = origin === 'manage-cdo' ? '/cdo/manage' : backNav.backLink
  this.model = {
    backLink,
    cancelLink: backLink,
    srcHashParam: backNav.srcHashParam,
    showBreadcrumbNotBackLink: origin === 'manage-cdo',
    indexNumber,
    generalError: {},
    errors: []
  }

  errorPusherDefault(error, this.model)
}

module.exports = ViewModel
