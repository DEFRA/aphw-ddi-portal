const { routes: ownerRoutes } = require('../../../constants/owner')
const { formatToGds } = require('../../../lib/date-helpers')
const { extractEmail, extractLatestAddress, extractLatestInsurance, extractTelephoneNumbers, formatAddressAsArray } = require('../../../lib/model-helpers')

function ViewModel (cdo) {
  const person = cdo.person
  const contacts = person.person_contacts
  const insurance = extractLatestInsurance(cdo.insurance)
  const latestAddress = extractLatestAddress(person.addresses)

  this.model = {
    backLink: ownerRoutes.home.get,
    dog: {
      id: cdo.dog.id,
      indexNumber: cdo.dog.indexNumber,
      status: cdo.dog.status,
      name: cdo.dog.name,
      breed: cdo.dog.breed,
      colour: cdo.dog.colour,
      sex: cdo.dog.sex,
      dateOfBirth: formatToGds(cdo.dog.dateOfBirth),
      dateOfDeath: formatToGds(cdo.dog.dateOfDeath),
      tattoo: cdo.dog.tattoo,
      microchipNumber: cdo.dog.microchipNumber,
      microchipNumber2: cdo.dog.microchipNumber2,
      dateExported: formatToGds(cdo.dog.dateExported),
      dateStolen: formatToGds(cdo.dog.dateStolen)
    },
    person: {
      id: person.id,
      personReference: person.personReference,
      firstName: person.firstName,
      lastName: person.lastName,
      dateOfBirth: formatToGds(person.dateOfBirth),
      addressLines: formatAddressAsArray(latestAddress),
      country: latestAddress.country,
      email: extractEmail(contacts),
      telephoneNumbers: extractTelephoneNumbers(contacts)
    },
    exemption: {
      certificateIssued: formatToGds(cdo.exemption?.certificateIssued),
      cdoIssued: formatToGds(cdo.exemption?.cdoIssued),
      cdoExpiry: formatToGds(cdo.exemption.cdoExpiry),
      court: cdo.exemption?.court,
      policeForce: cdo.exemption?.policeForce,
      dogLegislationOfficer: cdo.exemption?.legislationOfficer,
      applicationFeePaid: formatToGds(cdo.exemption?.applicationFeePaid),
      insuranceCompany: insurance.company?.company_name,
      policyNumber: insurance.policy_number,
      insuranceRenewalDate: formatToGds(insurance.expiryDate),
      neuteringConfirmed: formatToGds(cdo.exemption?.neuteringConfirmed),
      microchipConfirmed: formatToGds(cdo.registration?.microchipConfirmed),
      joinedInterimScheme: formatToGds(cdo.exemption?.joinedInterimScheme)
    }
  }
}

module.exports = ViewModel
