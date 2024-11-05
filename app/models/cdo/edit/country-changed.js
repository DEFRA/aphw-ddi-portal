function ViewModel (data) {
  this.model = {
    policeForceName: data?.policeResult?.policeForceResult?.policeForceName,
    country: data?.country
  }
}

module.exports = ViewModel
