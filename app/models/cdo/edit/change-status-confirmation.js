const { getNewStatusLabel } = require('../../../lib/status-helper')

function ViewModel (dog, backNav) {
  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    indexNumber: dog.indexNumber,
    status: getNewStatusLabel(dog),
    actionLink: backNav.actionLink
  }
}

module.exports = ViewModel
