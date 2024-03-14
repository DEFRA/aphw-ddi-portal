const { routes, keys } = require('../../../constants/cdo/dog')
const { formatToGds } = require('../../../lib/date-helpers')

function ViewModel (dog) {
  this.model = {
    backLink: routes.confirm.get,
    dog: {
      id: dog.id,
      name: dog[keys.name],
      breed: dog[keys.breed],
      microchipNumber: dog[keys.microchipNumber],
      cdoIssued: formatToGds(dog[keys.cdoIssued]),
      cdoExpiry: formatToGds(dog[keys.cdoExpiry]),
      interimExemption: formatToGds(dog[keys.interimExemption])
    }
  }
}

module.exports = ViewModel
