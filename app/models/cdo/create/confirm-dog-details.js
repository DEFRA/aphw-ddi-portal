const { routes, keys } = require('../../../constants/cdo/dog')
const { routes: ownerRoutes } = require('../../../constants/cdo/owner')
const { formatToGds } = require('../../../lib/date-helpers')

function ViewModel (dogs) {
  this.model = {
    backLink: dogs?.length === 1 && dogs[0].indexNumber ? ownerRoutes.ownerDetails.get : routes.details.get,
    deleteLink: routes.delete.get,
    allowAddDog: !(dogs?.length === 1 && dogs[0].indexNumber),
    dogs: dogs.map((dog, index) => ({
      id: index + 1,
      name: dog[keys.name],
      microchipNumber: dog[keys.microchipNumber],
      microchipNumber2: dog[keys.microchipNumber2],
      breed: dog[keys.breed],
      cdoIssued: formatToGds(dog[keys.cdoIssued]),
      cdoExpiry: formatToGds(dog[keys.cdoExpiry]),
      interimExemption: formatToGds(dog[keys.interimExemption]),
      indexNumber: dog[keys.indexNumber]
    }))
  }
}

module.exports = ViewModel
