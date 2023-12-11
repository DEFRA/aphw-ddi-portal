const { formatToGds } = require('../../../lib/date-helpers')
const { formatAddress } = require('../../../lib/format-helpers')

function ViewModel (cdo) {
  const owner = cdo.owner
  const dogs = cdo.dogs
  const enforcementDetails = cdo.enforcementDetails

  this.model = {
    owner: {
      name: `${owner.firstName} ${owner.lastName}`,
      address: formatAddress(owner.address),
      birthDate: formatToGds(owner.birthDate)
    },
    enforcementDetails,
    dogs: dogs.map(dog => ({
      indexNumber: dog.indexNumber,
      name: dog.name,
      breed: dog.breed,
      cdoIssued: formatToGds(dog.cdoIssued),
      cdoExpiry: formatToGds(dog.cdoExpiry)
    }))
  }
}

module.exports = ViewModel
