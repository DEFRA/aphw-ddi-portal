const { routes } = require('../../../constants/cdo/dog')

function ViewModel (details) {
  this.model = {
    backLink: `${routes.microchipResults.get}/${details.id ?? details.dogId}`,
    dogId: details.id ?? details.dogId,
    microchipNumber: details.microchipNumber
  }
}

module.exports = ViewModel
