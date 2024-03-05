const { isEmptyDate } = require('../lib/date-helpers')

const buildCdoCreatePayload = (owner, address, enforcementDetails, dogs) => ({
  owner: {
    firstName: owner.firstName,
    lastName: owner.lastName,
    dateOfBirth: owner.dateOfBirth,
    address: {
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      town: address.town,
      postcode: address.postcode,
      country: address.country
    }
  },
  enforcementDetails: {
    court: enforcementDetails.court !== '' ? enforcementDetails.court : null,
    policeForce: enforcementDetails.policeForce,
    legislationOfficer: enforcementDetails.legislationOfficer
  },
  dogs: dogs.map(d => ({
    breed: d.breed,
    name: d.name,
    applicationType: d.applicationType,
    cdoIssued: d.cdoIssued,
    cdoExpiry: d.cdoExpiry,
    interimExemption: d.interimExemption
  }))
})

const buildPersonUpdatePayload = (person) => ({
  personReference: person.personReference,
  firstName: person.firstName,
  lastName: person.lastName,
  dateOfBirth: person.dateOfBirth,
  address: {
    addressLine1: person.addressLine1,
    addressLine2: person.addressLine2,
    town: person.town,
    postcode: person.postcode,
    country: person.country
  },
  email: person.email,
  primaryTelephone: person.primaryTelephone,
  secondaryTelephone: person.secondaryTelephone
})

const buildPersonAddressUpdatePayload = (person, address, singleSelect = false) => ({
  personReference: person.personReference,
  firstName: person.firstName,
  lastName: person.lastName,
  dateOfBirth: person.birthDate,
  address: {
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2,
    town: singleSelect ? address.addressTown : address.town,
    postcode: singleSelect ? address.addressPostcode : address.postcode,
    country: singleSelect ? address.addressCountry : address.country
  },
  email: person.contacts?.emails[0],
  primaryTelephone: person.contacts?.primaryTelephones[0],
  secondaryTelephone: person.contacts?.secondaryTelephones[0]
})

const buildExemptionDetailsUpdatePayload = (exemptionDetails) => {
  const payload = {
    indexNumber: exemptionDetails.indexNumber,
    cdoIssued: isEmptyDate(exemptionDetails.cdoIssued) ? null : exemptionDetails.cdoIssued,
    cdoExpiry: isEmptyDate(exemptionDetails.cdoExpiry) ? null : exemptionDetails.cdoExpiry,
    court: exemptionDetails.court,
    policeForce: exemptionDetails.policeForce,
    legislationOfficer: exemptionDetails.legislationOfficer,
    insurance: {
      company: exemptionDetails.insuranceCompany,
      renewalDate: exemptionDetails.insuranceRenewal
    },
    certificateIssued: exemptionDetails.certificateIssued ?? undefined,
    applicationFeePaid: exemptionDetails.applicationFeePaid ?? undefined,
    neuteringConfirmation: exemptionDetails.neuteringConfirmation ?? undefined,
    microchipVerification: exemptionDetails.microchipVerification ?? undefined,
    joinedExemptionScheme: exemptionDetails.joinedExemptionScheme ?? undefined,
    exemptionOrder: exemptionDetails.exemptionOrder ?? undefined,
    microchipDeadline: exemptionDetails.microchipDeadline ?? undefined,
    typedByDlo: exemptionDetails.typedByDlo ?? undefined,
    withdrawn: exemptionDetails.withdrawn ?? undefined,
    removedFromCdoProcess: exemptionDetails.removedFromCdoProcess ?? undefined
  }

  if (!payload.insurance.company && !payload.insurance.renewalDate) {
    delete payload.insurance
  }

  return payload
}

module.exports = {
  buildCdoCreatePayload,
  buildPersonUpdatePayload,
  buildExemptionDetailsUpdatePayload,
  buildPersonAddressUpdatePayload
}
