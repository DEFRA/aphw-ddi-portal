const { routes } = require('../../../constants/cdo/dog')

function ViewModel (details) {
  this.model = {
    backLink: routes.microchipSearch.get,
    dogId: details.id,
    microchipNumber: details.microchipNumber,
    results: details.results
  }
}

module.exports = ViewModel
