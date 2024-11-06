function ViewModel (data, breadcrumbLink) {
  this.model = {
    breadcrumbLink,
    policeForceName: data?.policeResult?.policeForceResult?.policeForceName,
    numberOfDogs: data?.policeResult?.policeForceResult?.numOfDogs
  }
}

module.exports = ViewModel
