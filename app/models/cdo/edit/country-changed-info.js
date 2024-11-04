function ViewModel (backNav) {
  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam
  }
}

module.exports = ViewModel
