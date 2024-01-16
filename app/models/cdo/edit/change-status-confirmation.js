function ViewModel (dog, backNav) {
  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    indexNumber: dog.indexNumber,
    status: dog.status
  }
}

module.exports = ViewModel
