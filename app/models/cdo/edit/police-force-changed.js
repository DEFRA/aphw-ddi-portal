function ViewModel (data, backNav) {
  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    policeForceName: data?.policeForceName,
    numberOfDogs: data?.numOfDogs
  }
}

module.exports = ViewModel
