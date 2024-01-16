const { routes } = require('../../../constants/cdo/dog')

function ViewModel (indexNumber, backNav) {
  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    formAction: routes.certificate.post,
    indexNumber
  }
}

module.exports = ViewModel
