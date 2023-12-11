const buildCdoCreatePayload = (owner, address, enforcementDetails, dogs) => ({
  owner: {
    firstName: owner.firstName,
    lastName: owner.lastName,
    dateOfBirth: owner.dateOfBirth,
    address: {
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      town: address.town,
      postcode: address.postcode
    }
  },
  enforcementDetails: {
    court: enforcementDetails.court,
    policeForce: enforcementDetails.policeForce,
    legislationOfficer: enforcementDetails.legislationOfficer
  },
  dogs: dogs.map(d => ({
    breed: d.breed,
    name: d.name,
    cdoIssued: d.cdoIssued,
    cdoExpiry: d.cdoExpiry
  }))
})

module.exports = {
  buildCdoCreatePayload
}
