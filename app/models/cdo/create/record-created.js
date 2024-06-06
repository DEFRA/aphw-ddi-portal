const { formatToGds } = require('../../../lib/date-helpers')
const { formatAddress, getCountryFromAddress } = require('../../../lib/format-helpers')

function ViewModel (cdo) {
  const owner = cdo.owner
  const dogs = cdo.dogs
  const enforcementDetails = cdo.enforcementDetails

  this.model = {
    owner: {
      name: `${owner.firstName} ${owner.lastName}`,
      address: formatAddress(owner.address, { hideCountry: true }),
      birthDate: formatToGds(owner.birthDate)
    },
    country: getCountryFromAddress(owner.address),
    enforcementDetails,
    dogs: dogs.map(dog => ({
      status: dog.status,
      indexNumber: dog.indexNumber,
      name: dog.name,
      microchipNumber: dog.microchipNumber,
      breed: dog.breed,
      cdoIssued: formatToGds(dog.cdoIssued),
      cdoExpiry: formatToGds(dog.cdoExpiry),
      interimExemption: formatToGds(dog.interimExemption)
    }))
  }
}

module.exports = ViewModel
