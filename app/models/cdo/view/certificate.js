function ViewModel (indexNumber, backNav) {
  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    indexNumber
  }
}

module.exports = ViewModel
