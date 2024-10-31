function ViewModel (data, breadcrumbLink) {
  this.model = {
    breadcrumbLink,
    policeForceName: data?.policeForceName,
    numberOfDogs: data?.numOfDogs
  }
}

module.exports = ViewModel
